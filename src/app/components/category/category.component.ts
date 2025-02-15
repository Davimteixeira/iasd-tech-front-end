import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  @Output() categoryCreated = new EventEmitter<Category>(); // Para informar quando uma nova categoria for criada

  categoryForm: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar categorias.';
        console.error('Erro ao carregar categorias:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: (newCategory) => {
          this.categories.push(newCategory); // Adiciona a nova categoria na lista sem recarregar a página
          this.categoryCreated.emit(newCategory); // Emite o evento de criação
          this.categoryForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erro ao criar categoria.';
          console.error('Erro ao criar categoria:', error);
          this.isLoading = false;
        }
      });
    }
  }
}
