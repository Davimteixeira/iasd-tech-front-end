import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'getCategories',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    productServiceSpy.getProducts.and.returnValue(of({ results: [] }));
    productServiceSpy.getCategories.and.returnValue(of({ results: [] }));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        MatCardModule,
        MatButtonModule,
        MatProgressSpinnerModule,
      ],
      declarations: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    productService = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productService.getProducts).toHaveBeenCalled();
  });

  it('should show loading spinner when fetching data', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should display error message when loading products fails', () => {
    productService.getProducts.and.returnValue(
      throwError(() => new Error('Erro ao carregar produtos'))
    );
    component.loadProducts();
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Erro ao carregar produtos.');
  });

  it('should call logout when logout button is clicked', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
