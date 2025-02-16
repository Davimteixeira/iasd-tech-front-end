import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    authServiceSpy.register.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ],
      declarations: [RegisterComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
  });

  it('should be invalid when form is empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should be invalid with short password', () => {
    component.registerForm.controls['username'].setValue('testuser');
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('12345');
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should be valid with proper username, email, and password', () => {
    component.registerForm.controls['username'].setValue('testuser');
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('password123');
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should disable the submit button when form is invalid', () => {
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTruthy();
  });

  it('should enable the submit button when form is valid', () => {
    component.registerForm.controls['username'].setValue('testuser');
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('password123');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeFalsy();
  });

  it('should call authService.register when form is submitted', () => {
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    component.registerForm.setValue(testUser);
    component.onSubmit();
    expect(authService.register).toHaveBeenCalledWith(testUser);
  });

  it('should display a loading spinner when submitting the form', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should show error messages when registration fails', () => {
    authService.register.and.returnValue(throwError(() => ({
      error: {
        username: ["Usuário com este username já existe."],
        email: ["Usuário com este email já existe."]
      }
    })));

    component.registerForm.controls['username'].setValue('testuser');
    component.registerForm.controls['email'].setValue('test@example.com');
    component.registerForm.controls['password'].setValue('password123');
    component.onSubmit();
    fixture.detectChanges();

    expect(component.registerErrors).toContain("Usuário com este username já existe.");
    expect(component.registerErrors).toContain("Usuário com este email já existe.");

    const errorMessages = fixture.nativeElement.querySelectorAll('.error-container mat-error');
    expect(errorMessages.length).toBe(2);
    expect(errorMessages[0].textContent).toContain("Usuário com este username já existe.");
    expect(errorMessages[1].textContent).toContain("Usuário com este email já existe.");
  });
});
