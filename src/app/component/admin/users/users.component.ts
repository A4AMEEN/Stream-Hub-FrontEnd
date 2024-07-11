import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  paginatedUsers: any[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  usersPerPage: number = 7;

  constructor(private authService: AuthService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.authService.getUsers().subscribe({
      next: (response: { users: any[]; }) => {
        this.users = response.users;
        this.updatePaginatedUsers();
      },
      error: (error: { error: { message: string; }; }) => {
        this.errorMessage = error.error.message || 'Error fetching users';
      }
    });
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    const endIndex = startIndex + this.usersPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.usersPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  
  blockUser(userId: string): void {
    // Confirm before blocking/unblocking
    if (window.confirm('Are you sure you want to perform this action?')) {
      this.authService.blockUser(userId).subscribe({
        next: (res: any) => {
          if (res.update) {
            const updatedUser = res.user;
            const index = this.paginatedUsers.findIndex(user => user._id === updatedUser._id);
            if (index !== -1) {
              this.paginatedUsers[index] = updatedUser;
              this.cdRef.detectChanges();
            }
          } else {
            // Handle error or feedback if needed
            console.error('Failed to update user status');
          }
        },
        error: (error: any) => {
          this.errorMessage = error.error.message || 'Error blocking user';
        }
      });
    } else {
      // Handle cancellation
      console.log('User cancelled the action.');
    }
  }
}
