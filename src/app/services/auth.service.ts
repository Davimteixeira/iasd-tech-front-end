import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, { email, password }).pipe(
      tap(response => {
        this.storeTokens(response);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        let errorMessage = 'Erro desconhecido no login.';
        if (error.error?.detail) {
          errorMessage = error.error.detail; 
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(user: { username: string; email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register/`, user).pipe(
      catchError(error => {
        let errorMessage = 'Erro desconhecido no registro.';
        if (error.error?.detail) {
          errorMessage = error.error.detail; 
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      return throwError(() => new Error('Token de refresh ausente.'));
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/token/refresh/`, { refresh }).pipe(
      tap(response => this.storeTokens(response)),
      catchError(error => {
        let errorMessage = 'Erro ao atualizar o token.';
        if (error.error?.detail) {
          errorMessage = error.error.detail;
        }
        this.logout(); // Logout automático se a renovação falhar
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expiry = tokenPayload.exp * 1000;
      return Date.now() < expiry;
    } catch (error) {
      return false;
    }
  }

  private storeTokens(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
  }
}
