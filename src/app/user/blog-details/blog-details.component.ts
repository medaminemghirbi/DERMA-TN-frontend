import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css'],
})
export class BlogDetailsComponent implements OnInit {
  blogDetail: any = [];
  messageErr = '';
  role : any
  constructor(
    private usersService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    private Auth :AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.Auth.getRole();



    const blogId = this.activatedRoute.snapshot.params['id'];
    this.usersService.getBlog(blogId).subscribe(
      (data) => {
        this.blogDetail = data;
        console.log(this.blogDetail);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We don't found this blog in our database";
      }
    );
  }


}
