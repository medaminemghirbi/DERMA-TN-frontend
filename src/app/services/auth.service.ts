import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  access_token: string | null = null;
  public connecte: boolean = false;
  public logged_in: boolean = false;

  constructor(private http: HttpClient) {}

  // Login method, assumes backend sets token in response
  login(data: any): Observable<any> {
    return this.http.post(environment.urlBackend + 'sessions', data);
  }

  register(data: any): Observable<any> {
    return this.http.post(environment.urlBackend + 'registrations', data);
  }
  logout() {
    this.connecte = false;
    sessionStorage.clear();
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
  updatepassword(id:string, password: string, newPassword: string, confirmPassword: string): Observable<any>{
    const body = { password, newPassword, confirmPassword};
    return this.http.patch(environment.urlBackend+'api/v1/updatepassword/' + id , body )
  }
  updateEmailNotificationPreference(userId: string, isEmailable: boolean) {
    return this.http.put(environment.urlBackend+`api/v1/users/${userId}/email_notifications`, { is_emailable: isEmailable });
  }
  updateSystemNotificationPreference(userId: string, isNotifiable: boolean) {
      return this.http.put(environment.urlBackend+`api/v1/users/${userId}/system_notifications`, { is_notifiable: isNotifiable });
  }
  updateworkinginsatudray(userId: string, working_saturday: boolean) {
    return this.http.put(environment.urlBackend+`api/v1/users/${userId}/working_saturday`, { working_saturday: working_saturday });
  }
  updatetoggleSmsNotifications(userId: string, is_smsable: boolean) {
    return this.http.put(environment.urlBackend+`api/v1/users/${userId}/sms_notifications`, { is_smsable: is_smsable });
  }
  updateWorkingOnLine(userId: string, working_on_line: boolean) {
    return this.http.put(environment.urlBackend+`api/v1/users/${userId}/working_online`, { working_on_line: working_on_line });
  }

  updateUserWalletAndAmount(userId: number, data: {  amount: string }) {
    return this.http.put(environment.urlBackend+`/api/v1/users/${userId}/update_wallet_amount`, data);
}

paywithkonnect(data:any){
  let headers = new HttpHeaders({'x-api-key':'672de5dabe3490452069964a:Ne4ehQWwQbDgDOqBpFxzyKj8VEjkbeN'});
  let options = { headers: headers };
  return this.http.post<any>("https://api.preprod.konnect.network/api/v2/payments/init-payment",data,options)

}
  ChangeDefaultLanguage(id: string, newdata: FormData) {
    return this.http.put(`${environment.urlBackend}api/v1/users/${id}/changeLanguage`, newdata);
  }


updateUserPhoneNumber(userId: number, data: {  phone_number: string }) {
  return this.http.put(environment.urlBackend+`/api/v1/users/${userId}/update_phone_number`, data);
}

}
