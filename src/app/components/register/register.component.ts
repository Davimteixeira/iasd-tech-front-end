import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  registerErrors: string[] = []; 
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.registerErrors = [];

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']); 
      },
      error: (error) => {
        this.isLoading = false;
        this.registerErrors = this.extractErrorMessages(error);
      }
    });
  }

  private extractErrorMessages(error: any): string[] {

    let messages: string[] = [];

    if (error.message) {
      messages.push(error.message);
    } else if (error.error && typeof error.error === 'object') {
      Object.entries(error.error).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          messages.push(...value); 
        } else if (typeof value === 'string') {
          messages.push(value);
        }
      });
    } else {
      messages.push("Erro desconhecido ao registrar.");
    }

    return messages;
  }
}
