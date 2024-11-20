import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.css']
})
export class NotificationSettingsComponent implements OnInit {
  currentUser : any
  paydata:any;

  constructor(private auth: AuthService, private translate: TranslateService) { 
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

    // Call the backend to update working_on_line status
    this.auth.updateWorkingOnLine(this.currentUser.id, isChecked).subscribe({
        next: (response) => {
            sessionStorage.setItem('doctordata', JSON.stringify(response));
            console.log('Working online status updated successfully!', response);
        },
        error: (error) => {
            console.error('Failed to update working online status', error);
        }
    });
}
updateReceiverWallet() {
    this.auth.updateUserWalletAndAmount(this.currentUser.id, {
        amount: this.currentUser.amount
    }).subscribe({
        next: (response) => {
            sessionStorage.setItem('doctordata', JSON.stringify(response));
            console.log('Wallet and amount updated successfully!', response);
        },
        error: (error) => {
            console.error('Failed to update wallet and amount', error);
        }
    });
}
toggleLanguage(event: any) {
    const selectedLanguage = event.target.value;




    const formData = new FormData();
    formData.append('language', String(selectedLanguage));

    // Call the service to update the location
    this.auth.ChangeDefaultLanguage(this.currentUser.id, formData).subscribe(
      response => {
        sessionStorage.setItem('doctordata', JSON.stringify(response));
        Swal.fire('Language updated!', '', 'success');
        this.translate.use(selectedLanguage); 
      },
      error => {
        console.error('Error updating Language:', error);
        Swal.fire('Failed to update Language', 'Please try again later .', 'error');
      }
    );
    }
}
