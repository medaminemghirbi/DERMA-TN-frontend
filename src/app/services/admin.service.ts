import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http : HttpClient , public router: Router) { }

  /////////////////////// Departments  */////////////////

  statistique(){
    return this.http.get(`${environment.urlBackend}`+'api/v1/statistique/')
  }
  getDoctors(){
    return this.http.get(`${environment.urlBackend}`+'api/v1/doctors/')
  }
  reloadData() {
    return this.http.get<any>(`${environment.urlBackend}`+'api/v1/reload_data/')
  }
  ArchiveDoctor(id:any){
    return this.http.delete(environment.urlBackend+'api/v1/doctors/' + id )
  }

}
