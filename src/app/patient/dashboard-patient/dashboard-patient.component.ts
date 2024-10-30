import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-dashboard-patient',
  templateUrl: './dashboard-patient.component.html',
  styleUrls: ['./dashboard-patient.component.css']
})
export class DashboardPatientComponent implements OnInit {
  currentuser: any;
  nextAppointment: any;
  remainingHours!: number;
  remainingMinutes!: number;
  AppointmentOfTheDay: any;
  DoctorStats: any;

  messageErr = "";
  show: boolean = false;
  now: any;

  constructor(private auth: AuthService, private doctorService: DoctorService) { 
    this.currentuser = this.auth.getcurrentuser();
    this.now = moment(); 
  }

  ngOnInit(): void {

    // Fetch appointments data
    this.doctorService.getDoctorAppointmentOfTheDay(this.currentuser.id).subscribe(
      (data) => {
        this.AppointmentOfTheDay = data;
        console.log(this.AppointmentOfTheDay);

        // Call calculateNextAppointment after data is loaded
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We couldn't find any appointments for today";
      }
    );
    this.doctorService.getDoctorStatistique(this.currentuser.id).subscribe(
      (data) => {
        this.DoctorStats = data;
        console.log(this.DoctorStats);},
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We couldn't find any stats for today";
      }
    );
  }

}
