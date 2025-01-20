import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-blogs-patient',
  templateUrl: './blogs-patient.component.html',
  styleUrls: ['./blogs-patient.component.css']
})
export class BlogsPatientComponent implements OnInit {
  allBlogs: any = [];
  messageErr = '';

  constructor(
    private usersService: AdminService,
    private router: Router,
  ) { }

  ngOnInit(): void {



    this.usersService.getVerfiedBlogs().subscribe(
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


}
