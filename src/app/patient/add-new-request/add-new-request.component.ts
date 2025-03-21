import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-new-request',
  templateUrl: './add-new-request.component.html',
  styleUrls: ['./add-new-request.component.css'],
})
export class AddNewRequestComponent implements OnInit {
  calendarVisible = true;
  selectedDoctor: string = '';
  p: number = 1;
  loading: boolean = false;

  today = new Date();
  calendarOptions!: CalendarOptions;
  currentEvents: EventApi[] = [];
  selectedDate!: string;
  isWeekend: boolean = false;
  currentUser: any;
  nearstdoctor: any = [];
  filteredDoctors: any = [];
  messageErr = '';
  searchedKeyword!: string;
  constructor(private auth: AuthService, private usersService: AdminService, 
       private toastr: ToastrService,
    private http: HttpClient ) {
    this.currentUser = this.auth.getcurrentuser();
    const hiddenDays = this.currentUser.working_saturday ? [0] : [0, 6];
    this.calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
      headerToolbar: {
        left: '',
        center: 'title',
      },
      initialView: 'timeGridDay',
      hiddenDays: hiddenDays, // Set hiddenDays based on user's schedule
      slotDuration: '00:30:00',
      slotLabelInterval: '00:30:00',
      slotMinTime: '09:00:00',
      slotMaxTime: '17:00:00',
      dayMaxEvents: true,
      height: 'auto',
      validRange: { start: this.formatDate(this.today) },
      allDaySlot: false,
    };
  }

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;

      this.nearstdoctor = await this.usersService
        .getNearstDoctor(this.currentUser.location, this.currentUser.radius)
        .toPromise();
      this.nearstdoctor.sort((a: any, b: any) =>
        a.firstname.localeCompare(b.firstname)
      );
      this.loading = false;

      console.log(this.nearstdoctor);
    } catch (error) {
      this.messageErr = "We couldn't find any nerst doctors in our database.";
    }
  }
  checkWeekend(event: any): void {
    const selectedDate = new Date(event.target.value);
    const day = selectedDate.getDay();

    // Check if the selected day is a weekend (Saturday = 6, Sunday = 0)
    if (day === 6 || day === 0) {
      this.isWeekend = true; // Set flag to show error
      this.selectedDate = ''; // Clear the invalid date
    } else {
      this.isWeekend = false; // Hide error if it's a valid date
    }
  }
  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  addMinutesToDate(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }
  getDoctorsByLocation(doctor: string): void {}
  logSelection() {
    console.log(
      'Selected Doctor:',
      this.selectedDoctor ? this.selectedDoctor : 'None'
    );
    console.log(
      'Selected Date:',
      this.selectedDate ? this.selectedDate : 'None'
    );
  }
  prevDay() {}
  nextDay() {}

  generateStars(totalRating: number, ratingCount: number): { filled: boolean }[] {
    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(averageRating)) {
        stars.push({ filled: true });
      } else if (i === Math.ceil(averageRating) && averageRating % 1 !== 0) {
        stars.push({ filled: true, partial: true });
      } else {
        stars.push({ filled: false });
      }
    }
    return stars;
  }

  searchDoctors(): void {
    this.loadDoctors(); 
    this.p = 1;
  }

  searchDoctorsbylocation() {
    this.p = 1;
    this.loadDoctors();
  }

  resetFilters(): void {
    this.loading = true;

    setTimeout(() => {
      this.searchedKeyword = '';
      this.loadDoctors();
      this.p = 1;
      this.loading = false;
    }, 500);
  }

  loadDoctors(): void {
    this.http.get<any>(`http://localhost:3000/api/v1/search_doctors?&query=${this.searchedKeyword}`)
      .subscribe(data => {
        this.filteredDoctors = data;
        console.log(this.filteredDoctors)
      }, error => {
        this.toastr.error('Failed to load doctors');
      });
  }
}
