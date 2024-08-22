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
  isLoading: boolean = false;

  messageErr: string = '';
  p:number = 1 ;
  searchedKeyword!:string;
  constructor(private usersService: AdminService, private route: Router) { }

  ngOnInit(): void {
    this.loadDoctors(); // Load initial data
  }
  loadDoctors(): void {
    this.isLoading = true;
    this.usersService.getDoctors().subscribe(data => {
      this.doctors = data;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching doctors', error);
      this.isLoading = false;
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
