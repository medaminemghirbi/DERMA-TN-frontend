import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  allBlogs: any = [];
  messageErr = '';

  constructor(
    private usersService: AdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {



    this.usersService.getAllBlogs().subscribe(
      (data) => {
        this.allBlogs = data;
        console.log(this.allBlogs);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We don't found this blog in our database";
      }
    );
  }

  AddVerification(id: any, i: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Add Verify to it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.addVerification(id).subscribe(
          response => {
            Swal.fire({
              title: 'Success!',
              text: 'The verification has been added successfully!',
              icon: 'success',
              confirmButtonText: 'OK',
              width: '400px',
            }).then(() => {
              // Reload the page after a successful update
              window.location.reload();
            });
          },
          error => {
            Swal.fire({
              title: 'Error!',
              text: 'There was an error adding the verification.',
              icon: 'error',
              confirmButtonText: 'OK',
              width: '400px',
            });
          }
        );
      }
    });
  }
  

}
