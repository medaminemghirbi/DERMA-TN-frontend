import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

  ArchiveDoctor(id:any){
    return this.http.delete(environment.urlBackend+'api/v1/doctors/' + id )
  }

}
