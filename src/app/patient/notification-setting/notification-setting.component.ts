import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.css']
})
export class NotificationSettingComponent implements OnInit {
  currentUser : any
  constructor(private auth: AuthService) { 
    this.currentUser = this.auth.getcurrentuser();
  }

  ngOnInit(): void {
  }
  toggleEmailNotifications(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.currentUser.is_emailable = isChecked;

    // Call your service to update the user's preference in the backend
    this.auth.updateEmailNotificationPreference(this.currentUser.id, isChecked).subscribe({

        next: (response) => {
            sessionStorage.setItem('doctordata', JSON.stringify(response));
            console.log('Email notification preference updated successfully!', response);
        },
        error: (error) => {
            console.error('Failed to update email notification preference', error);
        }
    });
}

toggleSystemNotifications(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.currentUser.is_notifiable = isChecked;

    // Call your service to update the user's preference in the backend
    this.auth.updateSystemNotificationPreference(this.currentUser.id, isChecked).subscribe({
        next: (response) => {
            sessionStorage.setItem('doctordata', JSON.stringify(response));
            console.log('System notification preference updated successfully!', response);
        },
        error: (error) => {
            console.error('Failed to update system notification preference', error);
        }
    });
}
toggleWorkingSaturday(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.currentUser.working_saturday = isChecked;

    // Call your service to update the user's preference in the backend
    this.auth.updateworkinginsatudray(this.currentUser.id, isChecked).subscribe({
        next: (response) => {
            sessionStorage.setItem('doctordata', JSON.stringify(response));
            console.log('Workin in saturday updated successfully!', response);
        },
        error: (error) => {
            console.error('Failed to update Workin in saturday', error);
        }
    });
}

toggleSmsNotifications(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.currentUser.is_smsable = isChecked;

    // Call your service to update the user's preference in the backend
    this.auth.updatetoggleSmsNotifications(this.currentUser.id, isChecked).subscribe({
        next: (response) => {
            sessionStorage.setItem('doctordata', JSON.stringify(response));
            console.log('Workin in saturday updated successfully!', response);
        },
        error: (error) => {
            console.error('Failed to update Workin in saturday', error);
        }
    });
}
toggleWorkingOnLine(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.currentUser.working_on_line = isChecked;

    // Call your service to update the user's preference in the backend
    this.auth.updateWorkingOnLine(this.currentUser.id, isChecked).subscribe({
        next: (response) => {
            sessionStorage.setItem('doctordata', JSON.stringify(response));
            console.log('Workin on Line updated successfully!', response);
        },
        error: (error) => {
            console.error('Failed to update Workin online', error);
        }
    });
}

}
