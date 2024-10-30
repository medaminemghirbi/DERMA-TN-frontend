import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.css']
})
export class SelectDateComponent implements OnInit {
  selectedDoctorData : any
  selectedDoctorId: string | null = null; // Doctor's ID
  weekDays: any
  TimesLines:any
  messageErr = "";
  currentWeekIndex: number = 0;
  openedAccordionIndex: number | null = null;
  constructor(private activatedRoute: ActivatedRoute, private doc: DoctorService, private router: Router) { }

  ngOnInit(): void {
    this.selectedDoctorId = this.activatedRoute.snapshot.params['id'];

    // Fetch doctor data
    this.doc.getWeekDaysByDoctor(this.selectedDoctorId).subscribe({
      next: (data) => {
        this.weekDays = data;
        console.log(this.weekDays)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We don't find this user in our database.";
      }
    });

    this.doc.getSelectedDoctor(this.selectedDoctorId).subscribe({
      next: (data) => {
        this.selectedDoctorData = data;
        console.log(this.selectedDoctorData)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We don't find this user in our database.";
      }
    });
  }
  getCurrentWeekDays() {
    const start = this.currentWeekIndex * 6; // Start index for the current week (0 for first week)
    return this.weekDays?.slice(start, start + 6); // Get days for the current week
  }

  next() {
    if ((this.currentWeekIndex + 1) * 6 < this.weekDays.length) {
      this.currentWeekIndex++;
    }
    this.openedAccordionIndex = null; // Close if already open
    this.TimesLines = null; 
  }

  previous() {
    if (this.currentWeekIndex > 0) {
      this.currentWeekIndex--;
    }
    this.openedAccordionIndex = null; // Close if already open
    this.TimesLines = null; 
  }
  handleAccordionToggle(day: any, index: number) {
    // Check if the clicked accordion is already opened
    if (this.openedAccordionIndex === index) {
        this.openedAccordionIndex = null; // Close if already open
        this.TimesLines = null; // Reset TimesLines when closing
    } else {
        this.openedAccordionIndex = index; // Open the new accordion
        // Fetch available times for the selected day
        this.doc.getAvailableTimes(this.selectedDoctorId, day.date).subscribe({
            next: (data) => {
                this.TimesLines = data;
                console.log(`Available times for ${day.day} - ${day.date}:`, this.TimesLines);
            },
            error: (err: HttpErrorResponse) => {
                console.log(err);
                this.messageErr = "We don't find this user in our database.";
                this.TimesLines = null; // Reset TimesLines on error
            }
        });
    }
  }
  display(day: any, time: any) {
    const dateString = `${day.date}T${time}:00`;  // Combine date and time into an ISO string
    const dateObject = new Date(dateString);      // Create a JavaScript Date object
  
    // Adjust for GMT+1 by adding 1 hour
    const gmtPlusOneDate = new Date(dateObject.getTime() + 60 * 60 * 1000);
  
    console.log("Formatted Date Object with GMT+1:", gmtPlusOneDate);
  
    // Convert to ISO string in the GMT+1 time zone
    const formattedForDatabase = gmtPlusOneDate.toISOString().slice(0, -1);  // Remove the 'Z' at the end
    this.router.navigate([`patient/${this.selectedDoctorData.id}/book-now/${formattedForDatabase}`]);

  }
}