import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiUrl = environment.urlBackend + 'api/v1/blogs/';
  deletePhoneNumber: any;

  constructor(private http: HttpClient, public router: Router) {}
  /////////////////////// Blogs */////////////////////
  getDoctorAppointmentOfTheDay(id: any) {
    return this.http.get(
      environment.urlBackend + 'api/v1/doctor_consultations_today/' + id
    );
  }
  getDoctorStatistique(id: any) {
    return this.http.get(
      environment.urlBackend + 'api/v1/doctor_stats/' + id
    );
  }
  anaylzeImage(newprofile: any) {
    return this.http.post(environment.urlBackend + 'predict/', newprofile);
  }
  analyzeImage(imageFormData: FormData, id: any) {
    return this.http.post(
      environment.urlBackend + 'predict/' + id,
      imageFormData
    );
  }


  getAllMaladie(){
    return this.http.get(environment.urlBackend + 'api/v1/maladies' );
  }
  createBlog(data: FormData): Observable<any> {
    return this.http.post(`${environment.urlBackend}api/v1/blogs`, data);
  }
  fetchDoctorConsultations(doctor_id:any) {
    return this.http.get<any[]>(`${environment.urlBackend}api/v1/doctor_consultations/${doctor_id}`);
  }
  ArchiveConsultation(id: any) {
    return this.http.delete(environment.urlBackend + 'api/v1/consultations/' + id);
  }

  doctor_appointments(doctor_id:any) {
    return this.http.get<any[]>(`${environment.urlBackend}api/v1/doctor_appointments/${doctor_id}`);
  }
  getMyPhoneNumbers(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.urlBackend}/api/v1/phone_numbers?doctor_id=${doctorId}`);
  }
  createPhoneNumber(doctorId: string, phoneNumberData: { number: string; phone_type: string }) {
    return this.http.post<any>(`${environment.urlBackend}api/v1/phone_numbers`, {
      phone_number: {
        doctor_id: doctorId,
        number: phoneNumberData.number,
        phone_type: phoneNumberData.phone_type
      }
    });
  }

  ArchivePhone(phoneId: any) {

    return this.http.delete<any>(`${environment.urlBackend}api/v1/phone_numbers/${phoneId}`);
  }
  updatePhoneNumber(phoneId: number, phoneNumber: { number: string, phone_type: string }): Observable<any> {
    const body = {
      phone_number: {
        number: phoneNumber.number,
        phone_type: phoneNumber.phone_type
      }
    };

    return this.http.put<any>(`${environment.urlBackend}api/v1/phone_numbers/${phoneId}`, body);
  }
  updateAppointment(id:string,newdata:any){
    return this.http.patch(environment.urlBackend+'api/v1/consultations/' + id , newdata )
  }
  update_location(id: string, newdata: FormData) {
    return this.http.patch(`${environment.urlBackend}api/v1/update_location/${id}`, newdata);
  }
  
  updatedoctorimage (id:string,newprofile:any){
    return this.http.patch(environment.urlBackend+'api/v1/updatedoctorimage/' + id , newprofile )
  }
  updatedoctorprofil(id:string,newprofile:any){
    return this.http.patch(environment.urlBackend+'api/v1/updatedoctor/' + id , newprofile )
  }
  updatedoctorinformations(id:string,newprofile:any){
    return this.http.patch(environment.urlBackend+'api/v1/update_uesr_informations/' + id , newprofile )
  }
}