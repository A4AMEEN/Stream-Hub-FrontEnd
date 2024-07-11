import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../env/environment';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// Import jwt-decode
import { jwtDecode } from 'jwt-decode'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  
  private baseUrl = environment.BASE_URL;
  private tokenKey = 'authToken';
  private userRoleKey = 'userRole'; // Store user role in localStorage

  constructor(private http: HttpClient, private router: Router) {}

  signup(userData: any): Observable<any> {
    console.log('sending request');
    return this.http.post(`${this.baseUrl}users/signup`, userData);
  }

  login(userData: any): Observable<any> {
    console.log('sending request');
    return this.http.post<any>(`${this.baseUrl}users/login`, userData).pipe(
      tap(response => {
        console.log('response from backend', response); // Log the entire response for debugging
        if (response.token && response.message) { // Ensure the response has a token and message
          console.log('token from backend', response.token);
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userRoleKey, response.message); // Store role in localStorage
        }
      })
    );
  }

  logout(): void {
    console.log('logging out');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userRoleKey); // Remove role from localStorage
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.userRoleKey);
  }

  isUserAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  isUserRegular(): boolean {
    return this.getUserRole() === 'Login SuccessFully';
  }

  getUserData(): any {
    const token = this.getToken();
    console.log("token Founded at fronted",token);
    
    if (token) {
      // Correct usage of jwtDecode
      const datas= jwtDecode(token);
      console.log("The data isnide is ",datas);
      return datas
      
    }
    return null;
  }
  getUsers(): Observable<any> {
    console.log("HELLOOOOOH WORKD");
    
    return this.http.get(`${this.baseUrl}admin/users`);
  }

  blockUser(userId: string): Observable<any> {
    console.log("entered ServiceWorker",userId);
    return this.http.put(`${this.baseUrl}admin/blockuser/${userId}`, {});
  }

  sendOtp(email: string): Observable<any> {
    
    return this.http.post(`${this.baseUrl}users/send-otp`, {email});
  }

  verifyOtp(email: string, otp: string) {
    console.log("Email and otp",email,otp);
    
    return this.http.post(`${this.baseUrl}users/verify-otp`, { email, otp });
  }

   resetPassword(email:string,newPassword:string): Observable<any> {
    return this.http.post(`${this.baseUrl}users/forgot-password`, {email,newPassword });
   }

  changePassword(userId: string,oldPassword: string, newPassword: string): Observable<any> {
    console.log("deatisl",userId,oldPassword,newPassword);

    return this.http.post(`${this.baseUrl}users/reset-password`, { userId,oldPassword, newPassword });
  }
  

  getCategories(): Observable<{ name: string; _id: string }[]> {
    return this.http.get<{ name: string; _id: string }[]>(`${this.baseUrl}admin/categories`);
  }
  

  addCategory(name: string): Observable<any> {
    console.log("hellow hter");
    return this.http.post(`${this.baseUrl}admin/addCategory`, { name });
  }

  updateCategory(id: string, name: string): Observable<any> {
    console.log("updating category", id, name);
    return this.http.put(`${this.baseUrl}admin/updateCategory/${id}`, { name });
  }
  
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}admin/deleteCategory/${id}`);
  }

  
}
