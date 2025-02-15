import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryComponent } from './category.component';
import { CategoryService } from '../../services/category.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories', 'createCategory']);
    categoryServiceSpy.getCategories.and.returnValue(of({ results: [{ id: 1, name: 'Eletrônicos' }] }));
    categoryServiceSpy.createCategory.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ],
      declarations: [ CategoryComponent ],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(categoryService.getCategories).toHaveBeenCalled();
  });

  it('should show error message when category creation fails', () => {
    categoryService.createCategory.and.returnValue(throwError(() => new Error('Erro ao criar categoria')));
    component.categoryForm.controls['name'].setValue('Nova Categoria');
    component.onSubmit();
    expect(component.errorMessage).toBe('Erro ao criar categoria.');
  });
});
