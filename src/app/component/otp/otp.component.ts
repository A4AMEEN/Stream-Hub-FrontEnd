import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service'
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent {
  emailForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  step: number = 1;
  errorMessage: string = '';
  email:string=''

  constructor(private fb: FormBuilder, private authService: AuthService,private router:Router) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  sendOtp() {
    if (this.emailForm.invalid) return;
    const email = this.emailForm.value.email;
    this.authService.sendOtp(email).subscribe({
      next: (response: any) => {
        this.email = response.email; // Store email for later use
        console.log("emails from",this.email);
        
        this.step = 2;
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error sending OTP';
      }
    });
  }

  verifyOtp() {
    
    if (this.otpForm.invalid) return;
    const otp = this.otpForm.value.otp;
    
    console.log("emais otp",this.email,otp);
    this.authService.verifyOtp(this.email, otp).subscribe({
      next: () => {
        this.step = 3;
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Invalid OTP';
      }
    });
  }

  resetPassword() {
     if (this.passwordForm.invalid) return;
     const { newPassword } = this.passwordForm.value;
     this.authService.resetPassword(this.email, newPassword).subscribe({
       next: () => {
         alert('Password reset successfully');
         this.router.navigate(['/login'])
       },
       error: (error: { error: { message: string; }; }) => {
         this.errorMessage = error.error.message || 'Error resetting password';
       }
     });
  }
}
