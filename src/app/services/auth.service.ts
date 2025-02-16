import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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
      catchError(this.handleError) // Usa o novo método de tratamento de erros
    );
  }

  register(user: { username: string; email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register/`, user, {
      headers: new HttpHeaders({ 'Accept': 'application/json' }),
      responseType: 'json' // Certifica-se de que o Angular trata como JSON
    }).pipe(
      catchError(this.handleError)
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      return throwError(() => new Error('Token de refresh ausente.'));
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/token/refresh/`, { refresh }).pipe(
      tap(response => this.storeTokens(response)),
      catchError(this.handleError)
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

  /** Novo método para lidar com erros **/
  private handleError(error: HttpErrorResponse) {

    let errorMessage = 'Erro desconhecido.';
    if (error.status === 0) {
      errorMessage = "Falha na conexão com o servidor. Verifique sua internet ou tente novamente mais tarde.";
    } else if (error.error) {
      try {
        if (typeof error.error === 'string') {
          errorMessage = error.error; 
        } else if (typeof error.error === 'object') {
          errorMessage = Object.values(error.error).flat().join(" "); 
        }
      } catch (e) {
        console.error("Erro ao processar JSON da API:", e);
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
