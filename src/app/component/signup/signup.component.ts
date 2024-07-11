import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  special:any
  passwordHidden = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, this.nameValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator()]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  nameValidator(control: AbstractControl) {
    const regex = /^[a-zA-Z]+$/; // Regex to allow only alphabets
    return regex.test(control.value) ? null : { invalidName: true };
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const hasMinLength = value.length >= 8;
      const valid = hasNumber && hasSpecialChar && hasMinLength;
      return !valid ? { weakPassword: true } : null;
    };
  }
  togglePasswordVisibility(field: string) {
    const inputField = document.getElementById(field) as HTMLInputElement;
    inputField.type = this.passwordHidden ? 'text' : 'password';
    this.passwordHidden = !this.passwordHidden;
  }

  filterInput(event: KeyboardEvent) {
    const char = String.fromCharCode(event.charCode);
    const regex = /^[a-zA-Z]+$/;
    if (!regex.test(char)) {
      
      this.special="Special Expressions not allowed"
      setTimeout(() => {
        this.special=''
      }, 5000);
      event.preventDefault();
    }
    
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: (res => {
          if (res && res.message) {
            this.router.navigate(['/login']);
            alert(res.message);
          }
        }), error: (err => {
          if (err && err.error.message) {
            this.errorMessage = err.error.message;
            
            alert(err.error.message);
          }
        })
      });
    }
  }
}
