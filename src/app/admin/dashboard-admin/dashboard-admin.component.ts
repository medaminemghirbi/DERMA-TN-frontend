import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  messageErr= ""
  public userType: string = '';
  statistique:any = []; 
  admindata:any;

  appointement_count: any
  patient_count: any
  BLogs_count: any
  doctors_count: any
  scanned_count: any
  maladies_count: any
  constructor( private route: Router , private auth: AuthService,private usersService: AdminService ) { }

  ngOnInit(): void {
    this.admindata = JSON.parse( sessionStorage.getItem('admindata') !) ;
    this.userType = sessionStorage.getItem('user_type') || 'Guest';

    this.usersService.statistique().subscribe(data => {
      this.statistique = data;
      this.appointement_count =  this.statistique.apointements;
      this.patient_count = this.statistique.patients;
      this.BLogs_count =  this.statistique.blogs;
      this.doctors_count =  this.statistique.doctors;

      this.scanned_count =  this.statistique.scanned;

      this.maladies_count =  this.statistique.maladies;

    }, (err: HttpErrorResponse) => {
      this.messageErr = "We don't found any demande in our database";
    });
  }
}
