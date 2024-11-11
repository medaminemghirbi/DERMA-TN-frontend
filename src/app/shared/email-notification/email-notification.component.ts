import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-email-notification',
  templateUrl: './email-notification.component.html',
  styleUrls: ['./email-notification.component.css']
})
export class EmailNotificationComponent implements OnInit {
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

    //this.ws = new WebSocket('ws://localhost:3000/cable'); // Change this URL if needed
    this.ws = new WebSocket(
      `${environment.urlBackend.replace(/^http(s)?:\/\//, (match) => match === 'https://' ? 'wss://' : 'ws://').replace(/\/$/, '')}/cable`
    );
    
    this.ws.onopen = () => {
      console.log('WebSocket connection established.');
      this.ws?.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({ channel: 'MailChannel' })
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'confirm_subscription') {
        console.log('Subscribed to MailChannel.');
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
// Handle incoming notifications
handleNewNotification(data: any): void {
  // Check if the message and email information exist
  if (data.message && data.message.status === 'sent') { // Check if the email has been sent
      const { doctor_id, patient_id, subject, body } = data.message; // Extract relevant details

      // Create the notification message
      let notificationMessage = `New Email Arrived from Doctor ID: ${doctor_id}, Patient ID: ${patient_id}`; 
      let notificationColor: 'info' = 'info'; // Set notification color

      notificationMessage = `Doc Pro Notification! ${notificationMessage}`;

      // Display the notification using toastr
      this.toastr[notificationColor](notificationMessage, subject, {
          timeOut: 4000 // Display for 4 seconds
      });

      // Trigger change detection if necessary
      this.cdr.detectChanges();
  }
}


  
}
