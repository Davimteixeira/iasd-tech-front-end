import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:8000/api/categories/';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<{ results: Category[] }>(this.apiUrl).pipe(
      map((response) => response.results),
      catchError((error) => {
        console.error('Erro ao buscar categorias:', error);
        return throwError(() => new Error('Erro ao carregar categorias.'));
      })
    );
  }

  createCategory(category: { name: string }): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError((error) => {
        console.error('Erro ao criar categoria:', error);
        return throwError(() => new Error('Erro ao criar categoria.'));
      })
    );
  }
}
