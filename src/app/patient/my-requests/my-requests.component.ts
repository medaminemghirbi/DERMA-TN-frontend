import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadersCSS } from 'ngx-loaders-css';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  ratingExists: boolean = false; 
    loader: LoadersCSS = 'line-spin-fade-loader';
    bgColor = 'black';
    color = 'rgba(100, 100, 100, 0.5)';
  ws: WebSocket | undefined;
  selectedDoctor: any = null;
  selectedConsultation: any = null;
  selectedRating: number = 0; // Store the selected rating
  stars = [1, 2, 3, 4, 5]; // Define the stars for the rating
  feedback: string = '';
  myRequests: any = [];
  filteredRequests: any = [];
  currentUser : any;
  messageErr = "";
  searchedKeyword = "";
  update:any
  selectedStatus = ""; // To store the selected status filter
  messageSuccess =""
  p: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 25, 50, 100];
  datademande = {
    id: '',
    status: ''
  };
  items = [
    { status: 'approved' },
    { status: 'pending' },
    { status: 'finished' },
    { status: 'rejected' },
    { status: 'canceled' },
    { status: 'finished' },
  ];
  rating = 0; // Initialize rating
  isLoading: boolean = false;
  constructor(private usersService: AdminService, private auth: AuthService,    private http: HttpClient, private AdminService: AdminService, 
       private doctorService: DoctorService,    private cdr: ChangeDetectorRef,
       private toastr: ToastrService  ) {
    this.currentUser = this.auth.getcurrentuser();
    this.update = new FormGroup({
      status: new FormControl(''),

    });
  }

  async refreshRequests(): Promise<void> {
    try {
      // Fetch the requests
      this.isLoading =true
      this.myRequests = await this.usersService.getMyReuqests(this.currentUser.id).toPromise();
      this.isLoading =false
    } catch (error) {
      this.messageErr = "We couldn't find any doctors in our database.";
    }
  }
  async ngOnInit(): Promise<void> {
    try {
      // Fetch the requests
      this.myRequests = await this.usersService.getMyReuqests(this.currentUser.id).toPromise();
      this.filterRequests(); // Apply filtering after data is fetched
      console.log(this.myRequests)
    } catch (error) {
      this.messageErr = "We couldn't find any doctors in our database.";
    }

    this.initializeWebSocket();
  }

  // Filter requests based on the search keyword and status
  filterRequests() {
    // Apply both search and status filters
    this.filteredRequests = this.myRequests.filter((item: any) => {
      const matchesKeyword = item.doctor.firstname.toLowerCase().includes(this.searchedKeyword.toLowerCase()) ||
                             item.doctor.lastname.toLowerCase().includes(this.searchedKeyword.toLowerCase()) ||
                             item.patient.firstname.toLowerCase().includes(this.searchedKeyword.toLowerCase()) ||
                             item.patient.lastname.toLowerCase().includes(this.searchedKeyword.toLowerCase());

      const matchesStatus = this.selectedStatus ? item.status === this.selectedStatus : true;

      return matchesKeyword && matchesStatus;
    });
  }
  searchAppointment(): void {
    const trimmedKeyword = this.searchedKeyword ? this.searchedKeyword.trim() : '';
  
    if (trimmedKeyword) {
      this.filteredRequests = this.myRequests.filter((doctor: { firstname: string, lastname:string  }) =>
        doctor.firstname.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        doctor.lastname.toLowerCase().includes(trimmedKeyword.toLowerCase())

      );
    } else {
      this.filteredRequests = [...this.myRequests];
    }
  
    this.p = 1;
  }
  isToday(appointmentDate: string | Date): boolean {
    const today = new Date();
    const appointment = new Date(appointmentDate);

    return (
      today.getFullYear() === appointment.getFullYear() &&
      today.getMonth() === appointment.getMonth() &&
      today.getDate() === appointment.getDate()
    );
  }
  getdata(status: string,  id: any) {
    this.datademande.id = id;
    this.datademande.status = status;
    console.log(this.datademande);
  }
  handleClick(status: string, id: number) {
    if (status === 'pending') {
      // Proceed with the usual data fetching
      this.getdata(status, id);
    } else {
      // Show SweetAlert2 message
      Swal.fire({
        icon: 'error',
        title: 'Cannot Modify',
        text: 'You can only modify entries that are pending.',
      });
    }
  }
  updatedemande(f: any) {
    let data = f.value;
    const formData = new FormData();
    formData.append('status', this.update.value.status);
    formData.append('refus_reason', this.update.value.refus_reason);
    Swal.fire({
      title: 'Action Irreversible,Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        debugger;
        this.doctorService
          .updateAppointment(this.datademande.id, formData)
          .subscribe(
            (response) => {
              let indexId = this.myRequests.findIndex(
                (obj: any) => obj.id == this.datademande.id
              );

              //this.allConsultations[indexId].id=data.id
              this.myRequests[indexId].status = data.status;

              this.messageSuccess = `this demande : ${this.myRequests[indexId].status} is updated`;
            },
            (err: HttpErrorResponse) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You cant update twice!',
                footer: '<a href="">Why do I have this issue?</a>',
              });
            }
          );
        Swal.fire('Saved!', '', 'success');
        window.location.reload();
        //  window.location.reload();
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  pay(consultation_id:any){
    const formData = new FormData();
    formData.append('consultation_id', consultation_id);
    this.AdminService
    .Generate_payment_link(formData)
    .subscribe(
      (response) => {
        window.open(response.url);
      },
      (err: HttpErrorResponse) => {}
    );
  }

  rate(value: number) {
    this.rating = value;
    // Here you would typically send the rating to your backend
    console.log("Rated:", value);
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
        identifier: JSON.stringify({ channel: 'PaymentChannel' })
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'confirm_subscription') {
        console.log('Subscribed to PaymentChannel.');
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

  handleNewNotification(data: any): void {
    // Check if the message and email information exist
    if (data.message && data.message.status === 'sent') { // Check if the email has been sent
        const { message,subject } = data.message; // Extract relevant details
        debugger
        // Create the notification message
        let notificationMessage = `${message}`; 
        let notificationColor: 'info' = 'info'; // Set notification color
  
        notificationMessage = `Doc Pro Notification! ${notificationMessage}`;
  
        // Display the notification using toastr
        this.toastr[notificationColor](notificationMessage, subject, {
            timeOut: 10000 // Display for 4 seconds
        });
  
        // Trigger change detection if necessary
        this.cdr.detectChanges();
    }
  }
  
     // Open the rating modal and set the doctor details
     openRatingModal(item: any): void {
      console.log(item);
      this.selectedDoctor = item.doctor;
      this.selectedConsultation = item;
  
      // Call API to check if the rating exists
      const apiUrl = `http://127.0.0.1:3000/api/v1/check_rating`;
      const params = { consultation_id: this.selectedConsultation?.id };
  
      this.http.get<{ ratingExists: boolean }>(apiUrl, { params }).subscribe(
        (response) => {
          this.ratingExists = response.ratingExists;
  
          if (this.ratingExists) {
            console.log('Rating already exists. Disabling rating functionality.');
          } else {
            this.selectedRating = 0; // Reset the rating if no existing rating
            this.feedback = ''; // Reset the feedback
          }
        },
        (error) => {
          console.error('Error checking if rating exists:', error);
        }
      );
    }

  // Handle star selection
  selectRating(rating: number): void {
      this.selectedRating = rating;
  }

  submitRating(): void {
    // Prepare the data for the API
    const ratingData = {
      consultation_id: this.selectedConsultation?.id,
      comment: this.feedback,
      rating_value: this.selectedRating,
    };

    // Log the request data for debugging
    console.log('Submitting Rating:', ratingData);

    // API endpoint
    const apiUrl = 'http://127.0.0.1:3000/api/v1/rate_doctor';

    // Send the POST request
    this.http.post(apiUrl, ratingData).subscribe(
      (response) => {
        console.log('Rating submitted successfully:', response);
        Swal.fire('Thank you for rating this doctor through  DocPro! Your feedback helps us improve our services.', '', 'success').then(() => {
          // Find the index of the user and update the corresponding row
          window.location.reload()
        });
      },
      (error) => {
        console.log(error)
        console.error('Error submitting rating:', error);
        Swal.fire({ title: 'Erreur',text: error.error.error, icon: 'error', confirmButtonText: 'OK'}).then(() => {
          // Find the index of the user and update the corresponding row
          window.location.reload()
        });
      }
    );
  }

  
}
