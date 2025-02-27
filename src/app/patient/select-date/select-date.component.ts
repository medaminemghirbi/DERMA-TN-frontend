import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.css']
})
export class SelectDateComponent implements OnInit {
  searchedKeyword!:string;
  currentYear: number = new Date().getFullYear();
  selectedDoctorData : any
  AllHoliday:any
  selectedDoctorId: string | null = null; // Doctor's ID
  weekDays: any
  TimesLines:any
  messageErr = "";
  currentWeekIndex: number = 0;
  openedAccordionIndex: number | null = null;
  p:number = 1 ;

  constructor(private activatedRoute: ActivatedRoute, private doc: DoctorService, private router: Router) { }

  ngOnInit(): void {
    this.selectedDoctorId = this.activatedRoute.snapshot.params['id'];
    this.doc.getAllHoliday().subscribe(
      (data) => {
        this.AllHoliday = data;
        console.log(this.AllHoliday);

        // Call calculateNextAppointment after data is loaded
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We couldn't find any appointments for today";
      }
    );

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

  isTimeDisabled(day: any, time: string): boolean {
    // Get the current date and time in GMT+1 (adjusted for local time)
    const now = new Date();
    const localNow = new Date(now.getTime() + (60 * 60 * 1000)); // Adjust for GMT+1 (adding 1 hour)
  
    // Combine the day.date and time into a full date string
    const dateString = `${day.date}T${time}:00`;
  
    // Create a Date object from the date string
    const slotTime = new Date(dateString);
  
    // Adjust the slot time for GMT+1 (if necessary)
    const adjustedSlotTime = new Date(slotTime.getTime() + (60 * 60 * 1000)); // Adjust for GMT+1
    
    // Return true if the slot time is earlier than the current time
    return adjustedSlotTime < localNow;
  }
  
  isHoliday(day: any): boolean {
    return this.AllHoliday.some((holiday: { holiday_date: any; }) => holiday.holiday_date === day.date);
  }

  isPastHoliday(holidayDate: string): boolean {
    const currentDate = new Date();
    const holiday = new Date(holidayDate);
    return currentDate > holiday;
  }

  getHolidayName(day: any): string | null {
    const holiday = this.AllHoliday.find((h: { holiday_date: any; }) => h.holiday_date === day.date);
    return holiday ? holiday.holiday_name : null;
  }
  isToday(day: any): boolean {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    return day.date === today; // Compare with the given day's date
}

}