import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard-doctor',
  templateUrl: './dashboard-doctor.component.html',
  styleUrls: ['./dashboard-doctor.component.css']
})
export class DashboardDoctorComponent implements OnInit {
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

        // Call calculateNextAppointment after data is loaded
        this.calculateNextAppointment();
      },
      (err: HttpErrorResponse) => {
        this.messageErr = "We couldn't find any appointments for today";
      }
    );
    this.doctorService.getDoctorStatistique(this.currentuser.id).subscribe(
      (data) => {
        this.DoctorStats = data;
        console.log(this.DoctorStats);},
      (err: HttpErrorResponse) => {
        this.messageErr = "We couldn't find any stats for today";
      }
    );
  }

  calculateNextAppointment() {
    const now = moment(); // Current time in local time zone

    if (!this.AppointmentOfTheDay || this.AppointmentOfTheDay.length === 0) {
      this.nextAppointment = null;
      return;
    }

    // Filter today's appointments
    const todayAppointments = this.AppointmentOfTheDay.filter((app: any) => {
      const appointmentDate = moment(app.appointment);
      return appointmentDate.isSame(now, 'day'); // Check if the appointment is today
    });

    // Use appointment from consultation for upcoming appointments
    const upcomingAppointments = todayAppointments
      .filter((app: { appointment: string; }) => {
        const appointmentTime = moment(app.appointment);

        // Check if the appointment time is after the current time
        return appointmentTime.isAfter(now); // Check if appointment time is after the current time
      })
      .sort((a: { appointment: string; }, b: { appointment: string; }) => {
        return moment(a.appointment).diff(moment(b.appointment)); // Sort by start time
      });

    if (upcomingAppointments.length > 0) {
      this.nextAppointment = upcomingAppointments[0];
      this.calculateRemainingTime(this.nextAppointment.appointment);
    } else {
      this.nextAppointment = null;
      this.show = true
    }
  }

  calculateRemainingTime(nextAppointmentTime: string) {
    const now = moment();
    const appointmentTime = moment(nextAppointmentTime);
    const duration = moment.duration(appointmentTime.diff(now));

    this.remainingHours = Math.floor(duration.asHours());
    this.remainingMinutes = Math.floor(duration.minutes());

  }
}
