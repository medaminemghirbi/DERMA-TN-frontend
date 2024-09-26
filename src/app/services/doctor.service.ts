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
  getDayOfTheYear() {
    return this.http.get(`${environment.urlBackend}api/v1/all_dates_in_year`);
  }

  
}
