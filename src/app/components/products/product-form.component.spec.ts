import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getCategories',
      'createProduct',
    ]);

    productServiceSpy.getCategories.and.returnValue(
      of({ results: [{ id: 1, name: 'Eletrônicos' }] })
    );
    productServiceSpy.createProduct.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatProgressSpinnerModule,
      ],
      declarations: [ProductFormComponent],
      providers: [{ provide: ProductService, useValue: productServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    productService = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.productForm.value).toEqual({
      name: '',
      description: '',
      price: '',
      category: '',
    });
  });

  it('should be invalid when form is empty', () => {
    expect(component.productForm.invalid).toBeTruthy();
  });

  it('should be valid when all fields are filled correctly', () => {
    component.productForm.controls['name'].setValue('Produto Teste');
    component.productForm.controls['description'].setValue(
      'Descrição do produto'
    );
    component.productForm.controls['price'].setValue('100');
    component.productForm.controls['category'].setValue(1);
    expect(component.productForm.valid).toBeTruthy();
  });

  it('should display an error message when price is negative', () => {
    component.productForm.controls['price'].setValue('-1');
    fixture.detectChanges();
    const priceError = fixture.nativeElement.querySelector('mat-error');
    expect(priceError).toBeTruthy();
  });

  it('should call createProduct service on valid form submission', () => {
    component.productForm.controls['name'].setValue('Produto Teste');
    component.productForm.controls['description'].setValue(
      'Descrição do produto'
    );
    component.productForm.controls['price'].setValue('100');
    component.productForm.controls['category'].setValue(1);

    component.onSubmit();

    expect(productService.createProduct).toHaveBeenCalledWith({
      name: 'Produto Teste',
      description: 'Descrição do produto',
      price: '100',
      category: 1,
    });
  });

  it('should show an error message when product creation fails', () => {
    productService.createProduct.and.returnValue(
      throwError(() => new Error('Erro ao criar produto'))
    );

    component.productForm.controls['name'].setValue('Produto Teste');
    component.productForm.controls['description'].setValue(
      'Descrição do produto'
    );
    component.productForm.controls['price'].setValue('100');
    component.productForm.controls['category'].setValue(1);

    component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Erro ao criar produto');
  });
});
