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
        console.log(this.AppointmentOfTheDay);

        // Call calculateNextAppointment after data is loaded
        this.calculateNextAppointment();
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

  calculateNextAppointment() {
    const now = moment(); // Current time in local time zone
    console.log("Current time:", now.format());

    if (!this.AppointmentOfTheDay || this.AppointmentOfTheDay.length === 0) {
      this.nextAppointment = null;
      console.log("No appointments for today.");
      return;
    }

    // Filter today's appointments
    const todayAppointments = this.AppointmentOfTheDay.filter((app: any) => {
      const appointmentDate = moment(app.appointment);
      return appointmentDate.isSame(now, 'day'); // Check if the appointment is today
    });

    // Use start_at from consultation for upcoming appointments
    const upcomingAppointments = todayAppointments
      .filter((app: { start_at: string; }) => {
        const appointmentTime = moment(app.start_at);
        console.log("Appointment start time:", appointmentTime.format()); // Debug log

        // Check if the appointment time is after the current time
        return appointmentTime.isAfter(now); // Check if appointment time is after the current time
      })
      .sort((a: { start_at: string; }, b: { start_at: string; }) => {
        return moment(a.start_at).diff(moment(b.start_at)); // Sort by start time
      });

    if (upcomingAppointments.length > 0) {
      this.nextAppointment = upcomingAppointments[0];
      this.calculateRemainingTime(this.nextAppointment.start_at);
    } else {
      this.nextAppointment = null;
      this.show = true
      console.log(this.show)
      console.log("No upcoming appointments.");
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
