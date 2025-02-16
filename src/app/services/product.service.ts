import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product, Category, CategoryResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ results: Product[] }> {
    return this.http
      .get<{ results: Product[] }>(`${this.apiUrl}/products/`)
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar produtos:', error);
          return throwError(() => error);
        })
      );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http
      .post<Product>(`${this.apiUrl}/products/`, {
        ...product,
        price: String(product.price),
      })
      .pipe(
        catchError((error) => {
          console.error('Erro ao criar produto:', error);
          return throwError(() => error);
        })
      );
  }

  getCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/categories/`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar categorias:', error);
        return throwError(() => error);
      })
    );
  }

  createCategory(category: { name: string }): Observable<Category> {
    return this.http
      .post<Category>(`${this.apiUrl}/categories/`, category)
      .pipe(
        catchError((error) => {
          console.error('Erro ao criar categoria:', error);
          return throwError(() => error);
        })
      );
  }
}
