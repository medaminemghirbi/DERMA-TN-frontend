import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css'],
  
})
export class DoctorsComponent implements OnInit {
  doctors:any = []
  filteredDoctors:any = []

  isLoading: boolean = false;

  messageErr: string = '';
  p:number = 1 ;
  searchedKeyword: string = ''; // Initialized as an empty string
  constructor(private usersService: AdminService, private route: Router) { }

  ngOnInit(): void {
    this.loadDoctors(); // Load initial data
  }
  loadDoctors(): void {
    this.isLoading = true;
    this.usersService.getDoctors().subscribe(data => {
      this.doctors = data;
      this.filteredDoctors = data;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching doctors', error);
      this.isLoading = false;
    });
  }

  searchDoctors(): void {
    const trimmedKeyword = this.searchedKeyword ? this.searchedKeyword.trim() : '';
  
    if (trimmedKeyword) {
      this.filteredDoctors = this.doctors.filter((doctor: { firstname: string, location:string, lastname:string  }) =>
        doctor.firstname.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        doctor.location.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        doctor.lastname.toLowerCase().includes(trimmedKeyword.toLowerCase())

      );
    } else {
      this.filteredDoctors = [...this.doctors];
    }
  
    this.p = 1;
  }
  
  opendataCSV() {

    Swal.fire({
      title: 'Careful this action will scrape doctors and import from CSV. It will take a lot of time. Are you sure?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.usersService.reloadData().subscribe(
          (data) => {
            this.isLoading = false;
            this.doctors = data.doctor; // Assuming data contains a `doctor` field
            Swal.fire('Doctors successfully imported!', '', 'success').then(() => {
              // Refresh the page after successful import
              window.location.reload();
            });
          },
          (err: HttpErrorResponse) => {
            this.isLoading = false;
            Swal.fire('Error', 'An error occurred while importing data.', err.error);
          }
        );
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });

  }
  refreshDoctors(): void {
    this.loadDoctors();
  }
  delete(id: any, i: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Archive it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.ArchiveDoctor(id).subscribe(
          response => {
            // If the deletion is successful, remove the user from the list
            this.doctors.splice(i, 1);
            Swal.fire(
              'Deleted!',
              'Contract type has been Archived.',
              'success'
            );
          },
          error => {
            // If there's an error, display the error message
            Swal.fire(
              'Error!',
              'You can\'t archvie user with active contract',
              'error'
            );
          }
        );
      }
    });
  }
}
