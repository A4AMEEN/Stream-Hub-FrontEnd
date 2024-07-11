import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl:'./login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  emailError: string | null = null;
  passwordError: string | null = null;
  
             
 

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.emailError = null;
      this.passwordError = null;
      this.authService.login(this.loginForm.value).subscribe({
        next: ((res: { message: any; }) => {
          console.log("Loogee",res.message);
          console.log("message from back end",res.message);
          
          
          if (res)
            if(res.message=="Admin")  {
            this.router.navigate(['/adminHome'])
            return
           
          }
          if (res && res.message) {
            this.router.navigate(['/landing'])
           
          }
        }), error: ((err: { error: { message: any; }; }) => {
          console.log("Loogee222");
          if (err && err.error.message) {
            this.emailError = err.error.message;
 
            this.passwordError = err.error.message;
          }
        })
      })
    }
  }
}