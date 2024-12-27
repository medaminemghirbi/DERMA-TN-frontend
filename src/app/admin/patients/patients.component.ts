import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients:any = []
  filterdPatients:any = []

  isLoading: boolean = false;
  sortOrder: 'asc' | 'desc' = 'asc';
  messageErr: string = '';
  p:number = 1 ;
  searchedKeyword: string = ''; // Initialized as an empty string
  constructor(private usersService: AdminService, private route: Router) { }
  isCollapsed: boolean[] = [];

  ngOnInit(): void {
    this.loadPatients(); // Load initial data
    this.isCollapsed = this.filterdPatients.map(() => true);
  }
    // Toggle the expanded/collapsed state
    toggleDescription(index: number): void {
      this.isCollapsed[index] = !this.isCollapsed[index];
    }
  loadPatients(): void {
    this.isLoading = true;
    this.usersService.getPatients().subscribe(data => {
      this.patients = data;
      this.filterdPatients = data;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching patients', error);
      this.isLoading = false;
    });
  }
  sortByName(): void {
    if (this.sortOrder === 'asc') {
      this.filterdPatients.sort((a: { location: string,firstname:string }, b: { location: string, firstname:string }) => a.firstname.localeCompare(b.firstname));
      this.sortOrder = 'desc';
    } else {
      this.filterdPatients.sort((a: { location: string, firstname:string }, b: { location: string, firstname:string }) => b.firstname.localeCompare(a.firstname));
      this.sortOrder = 'asc';
    }
  }
  searchpatients(): void {
    const trimmedKeyword = this.searchedKeyword ? this.searchedKeyword.trim() : '';
  
    if (trimmedKeyword) {
      this.filterdPatients = this.patients.filter((doctor: { firstname: string, lastname:string  }) =>
        doctor.firstname.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        doctor.lastname.toLowerCase().includes(trimmedKeyword.toLowerCase())

      );
    } else {
      this.filterdPatients = [...this.patients];
    }
  
    this.p = 1;
  }
  activateCompte(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Activate it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.activateCompte(id).subscribe(
          response => {
            // Display success message
            Swal.fire('Account Activated Successfully!', '', 'success').then(() => {
              // Find the index of the user and update the corresponding row
              const userIndex = this.filterdPatients.findIndex((user: { id: any; }) => user.id === id);
              if (userIndex !== -1) {
                this.filterdPatients[userIndex].email_confirmed = true;
                this.filterdPatients[userIndex].confirm_token = null;
                // Optionally, update any other UI elements related to this user
              }
            });
          },
          error => {
            // Handle errors if any
            Swal.fire('Error!', 'There was a problem activating the account.', 'error');
          }
        );
      }
    });
  }

  refreshpatients(): void {
    this.loadPatients();
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
            this.patients.splice(i, 1);
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
