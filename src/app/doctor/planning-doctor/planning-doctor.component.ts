import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS } from './event-utils';

@Component({
  selector: 'app-planning-doctor',
  templateUrl: './planning-doctor.component.html',
  styleUrls: ['./planning-doctor.component.css'],
})
export class PlanningDoctorComponent implements OnInit {
  calendarVisible = true;
  today = new Date(); // Get today's date
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek'
    },
    initialView: 'timeGridDay', // Set default view to daily time grid
    weekends: false, // Hide weekends if you only want weekdays
    editable: true,
    selectable: true,
    slotDuration: '00:30:00', // 30-minute slots
    slotLabelInterval: '00:30:00', // Show labels every 30 minutes
    slotMinTime: '09:00:00',
    slotMaxTime: '17:00:00',
    dayMaxEvents: true,
    height: 'auto', // Set height to auto or a specific value, like '600px'
    validRange: { start: this.formatDate(this.today) }, // Disable past dates
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    allDaySlot: false, // Disable all-day slots
  };
  
  currentEvents: EventApi[] = [];

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {}

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  // Helper function to format the date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
