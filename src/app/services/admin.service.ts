import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.urlBackend + 'api/v1/blogs/';

  constructor(private http : HttpClient , public router: Router) { }

  /////////////////////// Dcotors  */////////////////

  statistique(){
    return this.http.get(`${environment.urlBackend}`+'api/v1/statistique/')
  }
  getDoctors(){
    return this.http.get(`${environment.urlBackend}`+'api/v1/doctors/')
  }
  last_run(){
    return this.http.get(`${environment.urlBackend}`+'api/v1/last_run/')
  }
  reloadData() {
    return this.http.get<any>(`${environment.urlBackend}`+'api/v1/reload_data/')
  }
  ArchiveDoctor(id:any){
    return this.http.delete(environment.urlBackend+'api/v1/doctors/' + id )
  }
  activateCompte(id: any) {
    return this.http.post<any>(`${environment.urlBackend}api/v1/doctors/${id}/activate_compte`, {});
  }

  /////////////////////// Patients  */////////////////
  getPatients(){
    return this.http.get(`${environment.urlBackend}`+'api/v1/patients/')
  }
  ArchivePatient(id:any){
    return this.http.delete(environment.urlBackend+'api/v1/patients/' + id )
  }

    /////////////////////// Apointements  */////////////////
    getAllLocations(){
      return this.http.get(`${environment.urlBackend}`+'api/v1/all_locations/')
    }
    getDoctorsByLocation(location:any){
      return this.http.get(environment.urlBackend + 'api/v1/get_doctors_by_locations/' +location);
    }  
    getDoctorDetails(doctor_id: string): Observable<any> {
      return this.http.get<any>(environment.urlBackend + 'api/v1/doctor_consultations/' +doctor_id);
    }
    ArchiverAppointement(id:any){
      return this.http.delete(environment.urlBackend+'api/v1/consultations/' + id )
    }

    /////////////////////// Blogs */////////////////////
    getBlog(id:any){
      return this.http.get(environment.urlBackend + 'api/v1/blogs/'+ id);
    }
    getAllBlogs(){
      return this.http.get(environment.urlBackend + 'api/v1/blogs/');
    }
    getBlogMessages(id:any){
      return this.http.get(environment.urlBackend + 'api/v1/get_message_by_blog/'+ id);
    }
    addVerification(id: any): Observable<any> {
      const url = `${this.apiUrl}${id}`;
      const body = { is_verified: true };
      return this.http.patch(url, body);
    }

    get_user_data(id:any){
      return this.http.get(environment.urlBackend + 'api/v1/users/'+ id);
    }
}
