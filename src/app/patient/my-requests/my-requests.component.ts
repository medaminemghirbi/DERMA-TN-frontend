import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  myRequests: any = [];
  filteredRequests: any = [];
  currentUser : any;
  messageErr = "";
  searchedKeyword = "";
  update:any
  selectedStatus = ""; // To store the selected status filter
  messageSuccess =""
  p: number = 1;
  datademande = {
    id: '',
    status: ''
  };
  
  isLoading: boolean = false;
  constructor(private usersService: AdminService, private auth: AuthService,    private http: HttpClient, private AdminService: AdminService,    private doctorService: DoctorService  ) {
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
}
