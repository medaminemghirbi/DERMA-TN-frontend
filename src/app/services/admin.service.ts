import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.urlBackend + 'api/v1/blogs/';

  constructor(private http: HttpClient, public router: Router) {}

  /////////////////////// Dcotors  */////////////////

  statistique() {
    return this.http.get(`${environment.urlBackend}` + 'api/v1/statistique/');
  }
  getDoctors() {
    return this.http.get(`${environment.urlBackend}` + 'api/v1/doctors/');
  }
  last_run() {
    return this.http.get(`${environment.urlBackend}` + 'api/v1/last_run/');
  }

  reloadData() {
    return this.http.get<any>(
      `${environment.urlBackend}` + 'api/v1/reload_data/'
    );
  }

  ArchiveDoctor(id: any) {
    return this.http.delete(environment.urlBackend + 'api/v1/doctors/' + id);
  }
  activateCompte(id: any) {
    return this.http.post<any>(
      `${environment.urlBackend}api/v1/doctors/${id}/activate_compte`,
      {}
    );
  }

  getConsultation(code: any) {
    return this.http.get(environment.urlBackend + 'api/v1/find_consultation_by_code/' + code );
  }

  /////////////////////// Patients  */////////////////
  getPatients() {
    return this.http.get(`${environment.urlBackend}` + 'api/v1/patients/');
  }
  ArchivePatient(id: any) {
    return this.http.delete(environment.urlBackend + 'api/v1/patients/' + id);
  }

  /////////////////////// Apointements  */////////////////
  getAllLocations() {
    return this.http.get(`${environment.urlBackend}` + 'api/v1/all_locations/');
  }
  getDoctorsByLocation(location: any) {
    return this.http.get(
      environment.urlBackend + 'api/v1/get_doctors_by_locations/' + location
    );
  }
  getNearstDoctor(location: string, radius: number) {
    return this.http.get(
      environment.urlBackend + 'api/v1/nearest_doctors',
      {
        params: {
          location: location,
          radius: radius.toString()
        }
      }
    );
  }
  
  getDoctorDetails(doctor_id: string): Observable<any> {
    return this.http.get<any>(
      environment.urlBackend + 'api/v1/doctor_consultations/' + doctor_id
    );
  }
  ArchiverAppointement(id: any) {
    return this.http.delete(
      environment.urlBackend + 'api/v1/consultations/' + id
    );
  }

  /////////////////////// Blogs */////////////////////
  getBlog(id: any) {
    return this.http.get(environment.urlBackend + 'api/v1/blogs/' + id);
  }
  getAllBlogs() {
    return this.http.get(environment.urlBackend + 'api/v1/blogs/');
  }
  getVerfiedBlogs() {
    return this.http.get(environment.urlBackend + 'api/v1/verified_blogs/');
  }
  getMyBlogs(id: any) {
    return this.http.get(environment.urlBackend + 'api/v1/my_blogs/' + id);
  }
  getBlogMessages(id: any) {
    return this.http.get(
      environment.urlBackend + 'api/v1/get_message_by_blog/' + id
    );
  }
  addVerification(id: any): Observable<any> {
    const url = `${this.apiUrl}${id}`;
    const body = { is_verified: true };
    return this.http.patch(url, body);
  }

  get_user_data(id: any) {
    return this.http.get(environment.urlBackend + 'api/v1/users/' + id);
  }

  ArchiverMessage(id: any) {
    return this.http.delete(environment.urlBackend + 'api/v1/messages/' + id);
  }
  downloadImage(messageId: number, imageId: number): Observable<Blob> {
    const url = `${environment.urlBackend}api/v1/messages/${messageId}/images/${imageId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  ///////******MALADIES */*////////////////////
  getAllIAdiseas() {
    return this.http.get(environment.urlBackend + 'api/v1/maladies/');
  }
  updateDiseas(data:any){
    return this.http.patch(`${environment.urlBackend}api/v1/maladies/${data.id}`, data);
  }

  updateDocument(data:any){
    return this.http.patch(`${environment.urlBackend}api/v1/documents/${data.id}`, data);
  }
  getMyReuqests(id: any) {
    return this.http.get(environment.urlBackend + 'api/v1/patient_appointments/' + id);
  }


  sendMessage(message: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { message });
  }

  Generate_payment_link(formData: any): Observable<any> {
    return this.http.post(environment.urlBackend + 'api/v1/payments/generate', formData);
  }
  getDefaultLanguage(id: any) {
    return this.http.get(environment.urlBackend + 'api/v1/get_defaut_language/' + id);
  }



  getNotifications(id:any): Observable<any[]> {
    return this.http.get<any[]>(environment.urlBackend + 'api/v1/notifications/' + id);
  }

  // markAsRead(notificationId: number): Observable<any> {
  //   return this.http.patch(`${this.apiUrl}/${notificationId}/mark_as_read`, {});
  // }
}
