import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-planning-doctor',
  templateUrl: './planning-doctor.component.html',
  styleUrls: ['./planning-doctor.component.css'],
})
export class PlanningDoctorComponent implements OnInit {
  calendarVisible = true;
  consultations: any;
  currentUser: any;
  today = new Date();
  calendarOptions!: CalendarOptions;
  currentEvents: EventApi[] = [];
  messageErr = '';
  isLoading: boolean = false;

  constructor(
    private doctorSerivce: DoctorService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getcurrentuser();

    // Dynamically set hiddenDays based on whether the user works on Saturday
    const hiddenDays = this.currentUser.working_saturday ? [0] : [0, 6]; // Hide only Sunday if working_saturday is true, else hide both Sunday and Saturday

    this.calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridDay,timeGridWeek',
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

    this.loadConsultations();
  }

  loadConsultations(): void {
    this.doctorSerivce.fetchDoctorConsultations(this.currentUser.id).subscribe(
      (consultations) => {
        this.isLoading = true;
        const events = consultations.map((consultation) => ({
          title: `=> Consultation with Mr ${consultation.patient.firstname} ${consultation.patient.lastname}`,
          start: consultation.appointment,
          end: this.addMinutesToDate(new Date(consultation.appointment), 30),
          id: consultation.id,
          extendedProps: {
            patient: consultation.patient,
          },
        }));
        this.calendarOptions.events = events;
        this.isLoading = false;
      },
      (err: HttpErrorResponse) => {
        console.error('Error fetching consultations:', err);
        this.messageErr = "We don't found this blog in our database";
      }
    );
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
}
