import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  access_token: any = null;
  public connecte: boolean = false;
  logged_in: boolean = false;
  constructor(private http: HttpClient, public router: Router) {}

  login(data: any): Observable<any> {
    this.logged_in = true;
    this.connecte = true;
    return this.http.post(environment.urlBackend + 'sessions', data);
  }

  logout() {
    this.connecte = false;
    sessionStorage.clear();
    return this.http.delete(environment.urlBackend + 'logout/');
  }
  getcurrentuser() {
    const userTypeKeys = ['admindata', 'doctordata', 'patientdata'];
    for (const key of userTypeKeys) {
      const userData = sessionStorage.getItem(key);
      if (userData) {
        return JSON.parse(userData);
      }
    }

    // If no user is found, return null or handle the case where no user is logged in
    return null;
  }

  getToken() {
    this.access_token = sessionStorage.getItem('access_token');
    return this.access_token;
  }
}
