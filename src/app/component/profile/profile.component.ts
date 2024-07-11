import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  oldPassword: string = '';
  newPassword: string = '';
  showChangePassword: boolean = false;
  error: string = '';
  passwordError: string='';

  constructor(private authService: AuthService,private router:Router) {}

  ngOnInit(): void {
    this.user = this.authService.getUserData();
  }

  logout(): void {
    this.authService.logout();
  }

  resetPassword(): void {
    console.log("iddss",this.user._id);
    if (!this.oldPassword || !this.newPassword || this.newPassword.length < 8) {
      this.passwordError = 'Password must be strong and at least 8 characters long';
      return;
    }
    
    this.authService.changePassword(this.user._id, this.oldPassword, this.newPassword).subscribe({
      next: (response) => {
        // Handle success response
        console.log('Password changed successfully', response);
        this.router.navigate(['/landing'])
      },
      error: (error) => {
        // Handle error response
        this.error=error.error.message
        console.log(error);
        
        console.error('Error changing password', error.error.message);
      },
      complete: () => {
        // Handle completion (optional)
        console.log('Password reset process completed');
      }
    });
  }
  
}
