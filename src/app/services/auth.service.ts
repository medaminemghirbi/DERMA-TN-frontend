import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  access_token: string | null = null;
  public connecte: boolean = false;
  public logged_in: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  // Login method, assumes backend sets token in response
  login(data: any): Observable<any> {
    return this.http.post(environment.urlBackend + 'sessions', data);
  }

  // Logout method, clears session storage and redirects to login page
  logout(): Observable<any> {
    this.connecte = false;
    this.logged_in = false;
    sessionStorage.clear();
    this.router.navigate(['/login']);
    return this.http.delete(environment.urlBackend + 'logout/');
  }

  // Get current logged-in user data based on user type (Admin, Doctor, Patient)
  getcurrentuser(): any {
    const userTypeKeys = ['admindata', 'doctordata', 'patientdata'];
    for (const key of userTypeKeys) {
      const userData = sessionStorage.getItem(key);
      if (userData) {
        return JSON.parse(userData);
      }
    }
    return null;
  }

  // Get user role from session storage (Admin, Doctor, Patient)
  getRole(): string | null {
    return sessionStorage.getItem('user_type');
  }

  // Token retrieval function
  getToken(): string | null {
    if (!this.access_token) {
      this.access_token = sessionStorage.getItem('access_token');
    }
    return this.access_token;
  }

  // Helper function to set login data in session storage after successful login
  setLoginData(userData: any, userType: string, token: string): void {
    // Set user data based on type (admin, doctor, patient)
    sessionStorage.setItem(`${userType.toLowerCase()}data`, JSON.stringify(userData));
    sessionStorage.setItem('user_type', userType);
    sessionStorage.setItem('access_token', token);
    this.logged_in = true;
    this.connecte = true;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('access_token');
  }
}
