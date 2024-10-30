import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-now',
  templateUrl: './book-now.component.html',
  styleUrls: ['./book-now.component.css'],
})
export class BookNowComponent implements OnInit {
  selectedDoctorData: any;
  currentUser: any;
  selectedDoctorId: string | null = null;
  messageErr = '';
  appointmentDate!: string;
  appointmentTime!: string;
  appointmentDay!: string;
  isLoading: boolean = false;
  note_active: boolean = false;
  online: boolean = false;
  note: string = '';  // to hold the user's note

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private doc: DoctorService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getcurrentuser();
    this.selectedDoctorId = this.activatedRoute.snapshot.params['id'];
    this.doc.getSelectedDoctor(this.selectedDoctorId).subscribe({
      next: (data) => {
        this.selectedDoctorData = data;
        this.convertTimestamp(this.activatedRoute.snapshot.params['appointment']);
      },
      error: (err: HttpErrorResponse) => {
        this.messageErr = "We don't find this user in our database.";
      },
    });
  }
  
  confirmAppointment() {
    let registerButton = document.getElementById('registerButton') as HTMLButtonElement;
    registerButton.disabled = true;
    registerButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
    
    const formData = new FormData();
    formData.append('patient_id', this.currentUser.id);
    formData.append('doctor_id', this.selectedDoctorId!);
    formData.append('appointment', this.activatedRoute.snapshot.params['appointment']);
    formData.append('appointment_type', this.online ? '1' : '0');  // 1 for online, 0 for onsite
    if (this.note_active && this.note) {
      formData.append('note', this.note);  // send note if note_active is true
    }

    this.isLoading = true;

    this.http.post(`${environment.urlBackend}api/v1/consultations`, formData).subscribe(
      (response) => {
        Swal.fire('Whooa!', 'Appointment successfully created.', 'success').then(() => {
          registerButton.disabled = false;
          this.router.navigate(['/patient/appointment-request']);
          this.isLoading = false;
        });
      },
      (error) => {
        Swal.fire('Error!', 'Appointment Already created. Check your board or Change Date.', 'error');
        registerButton.disabled = false;
        registerButton.innerHTML = 'Confirm Appointment';
        this.isLoading = false;
      }
    );
  }

  cancelAppointment() {
    this.router.navigate([`/patient/${this.selectedDoctorId}/select-date`]);
  }

  convertTimestamp(dateString: string) {
    const date = new Date(dateString);
    this.appointmentDate = date.toISOString().split('T')[0];
    this.appointmentTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    this.appointmentDay = date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  toggleSmsNotifications(event: Event) {
    this.note_active = (event.target as HTMLInputElement).checked;
  }

  isonline(event: Event) {
    this.online = (event.target as HTMLInputElement).checked;
  }
}
