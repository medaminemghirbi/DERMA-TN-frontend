import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-notifiacation-alert',
  templateUrl: './notifiacation-alert.component.html',
  styleUrls: ['./notifiacation-alert.component.css']
})
export class NotifiacationAlertComponent implements OnInit {
  currentuser: any;
  role: any;

  ws: WebSocket | undefined;
  notifications: string[] = []; // Array to hold notifications

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private Auth: AuthService,
    private usersService: AdminService,
    private toastr: ToastrService
  ) {
    this.currentuser = this.Auth.getcurrentuser();
    this.role = this.Auth.getRole();
  }

  ngOnInit(): void {
    this.initializeWebSocket();
  }

  initializeWebSocket() {
    if (this.ws) return; // Avoid creating multiple WebSocket connections

    this.ws = new WebSocket('ws://localhost:3000/cable'); // Change this URL if needed

    this.ws.onopen = () => {
      console.log('WebSocket connection established.');
      this.ws?.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({ channel: 'ConsultationChannel' })
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'confirm_subscription') {
        console.log('Subscribed to ConsultationChannel.');
      } else {
        this.handleNewNotification(data);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed. Attempting to reconnect...');
      setTimeout(() => this.initializeWebSocket(), 1000); // Reconnect after 1 second
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  // Handle incoming notifications
  handleNewNotification(data: any): void {
    if (data.message && data.message.consultation) {
      const notificationMessage = `New consultation created see apointment dashboard`;
      this.toastr.info(notificationMessage);
      this.cdr.detectChanges();
    }
  }
}
