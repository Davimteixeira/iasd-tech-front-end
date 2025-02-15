import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: { [key: number]: string } = {};
  isLoading = false;
  errorMessage: string | null = null;
  showCategoryForm = false;  // ✅ Variável para mostrar/esconder o formulário

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.results; 
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar produtos.';
        console.error('Erro ao carregar produtos:', error);
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        categories.forEach((category) => {
          this.categories[category.id] = category.name;
        });
      },
      error: (error) => console.error('Erro ao carregar categorias:', error)
    });
  }

  getCategoryName(categoryId: number): string {
    return this.categories[categoryId] || 'Desconhecido';
  }

  toggleCategoryForm(): void {
    this.showCategoryForm = !this.showCategoryForm;  // ✅ Alterna a exibição do formulário
  }

  onCategoryCreated(newCategory: Category): void {
    this.categories[newCategory.id] = newCategory.name;
    this.showCategoryForm = false; // ✅ Fecha o formulário após criar a categoria
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ✅ Adicionamos a função para redirecionar ao clicar em "Meus Produtos"
  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
