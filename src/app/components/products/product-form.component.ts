import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.results;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar categorias';
        console.error('Erro ao carregar categorias:', error);
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.productService.createProduct(this.productForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.errorMessage = 'Erro ao criar produto';
          console.error('Erro ao criar produto:', error);
          this.isLoading = false;
        },
      });
    }
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
}
