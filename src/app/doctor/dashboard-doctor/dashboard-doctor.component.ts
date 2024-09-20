import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-dashboard-doctor',
  templateUrl: './dashboard-doctor.component.html',
  styleUrls: ['./dashboard-doctor.component.css']
})
export class DashboardDoctorComponent implements OnInit {
  currentuser : any
  AppointmentOfTheDay :any
  messageErr =""
  constructor( private auth: AuthService, private doctorService: DoctorService) { 
    this.currentuser = this.auth.getcurrentuser()
  }

  ngOnInit(): void {



    this.doctorService.getDoctorAppointmentOfTheDay(this.currentuser.id).subscribe(
      (data) => {
        this.AppointmentOfTheDay = data;
        console.log(this.AppointmentOfTheDay);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We don't found any appointment for today";
      }
    );
  }

}
