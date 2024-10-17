import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-requests',
  templateUrl: './appointment-requests.component.html',
  styleUrls: ['./appointment-requests.component.css'],
})
export class AppointmentRequestsComponent implements OnInit {
  isLoading: boolean = false;
  currentUser: any;
  searchedKeyword!: string;
  selectedStatus: string = '';
  p: number = 1;
  itemsPerPage = 10;
  filteredConsultations: any[] = [];
  messageErr = '';
  messageSuccess = '';
  update!: FormGroup;
  allConsultations: any;
  dataAppointment: any = {};
  datademande = {
    id: '',
    status: '',
    refus_reason: '',
  };
  constructor(
    private auth: AuthService,
    private doctorService: DoctorService,
    private toastr: ToastrService
  ) {
    // Initialize the reactive form
    this.update = new FormGroup({
      status: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.currentUser = this.auth.getcurrentuser();
    this.isLoading = true;
    this.doctorService.doctor_appointments(this.currentUser.id).subscribe(
      (consultations) => {
        this.allConsultations = consultations;
        this.filterConsultations();
        console.log(this.allConsultations);
        this.isLoading = false;
      },
      (err: HttpErrorResponse) => {
        console.error('Error fetching consultations:', err);
        this.messageErr = "We don't found this blog in our database";
      }
    );
  }
  getdata(status: string, refus_reason: string, id: any) {
    this.datademande.id = id;
    this.datademande.status = status;
    this.datademande.refus_reason = refus_reason;
    console.log(this.datademande);
  }
  handleClick(status: string, refus_reason: string, id: number) {
    if (status === 'pending') {
      // Proceed with the usual data fetching
      this.getdata(status, refus_reason, id);
    } else {
      // Show SweetAlert2 message
      Swal.fire({
        icon: 'error',
        title: 'Cannot Modify',
        text: 'You can only modify entries that are pending.',
      });
    }
  }
  filterConsultations() {
    // Filter the consultations based on the selected status and searched keyword
    this.isLoading = true;

    this.filteredConsultations = this.allConsultations.filter((item: any) => {
        // Check if the selected status matches the item's status
        const matchesStatus = this.selectedStatus ? item.status === this.selectedStatus : true;

        // Check if the searched keyword matches either the doctor's or the patient's name
        const matchesKeyword = this.searchedKeyword
            ? (item.patient.firstname.toLowerCase().includes(this.searchedKeyword.toLowerCase()) ||
               item.doctor.firstname.toLowerCase().includes(this.searchedKeyword.toLowerCase()))
            : true;
            this.isLoading = false;

        // Return true if both conditions are met
        return matchesStatus && matchesKeyword;
        
    });
}

  onStatusChange() {
    this.filterConsultations(); // Re-filter when status changes
  }
  onSearchChange() {
    this.filterConsultations(); // Re-filter when the search keyword changes
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
              let indexId = this.allConsultations.findIndex(
                (obj: any) => obj.id == this.datademande.id
              );

              //this.allConsultations[indexId].id=data.id
              this.allConsultations[indexId].status = data.status;
              this.allConsultations[indexId].refus_reason = data.refus_reason;

              this.messageSuccess = `this demande : ${this.allConsultations[indexId].status} is updated`;
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
}
