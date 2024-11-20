import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-planning-doctor',
  templateUrl: './planning-doctor.component.html',
  styleUrls: ['./planning-doctor.component.css'],
})
export class PlanningDoctorComponent implements OnInit {
  calendarVisible = true;
  modalVisible = false;
  consultations: any;
  currentUser: any;
  today = new Date();
  calendarOptions!: CalendarOptions;
  currentEvents: EventApi[] = [];
  messageErr = '';
  isLoading: boolean = false;
  selectedTime: Date | null = null; // To hold the selected time for the appointment
  selectedDate: Date | null = null; // To hold the selected date for the appointment
  bookedSlots: string[] = []; // Store booked time slots in a string array

  constructor(
    private doctorSerivce: DoctorService,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
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
      selectable: true,
      events: [],// To be populated after fetching consultations
      locale: this.currentUser.language
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

        // Create a set of booked time slots for easy lookup (just the start times)
        this.bookedSlots = consultations.map((consultation) =>
          this.formatDate(new Date(consultation.appointment)) + " " + new Date(consultation.appointment).toLocaleTimeString()
        );

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
