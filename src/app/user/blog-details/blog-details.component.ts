import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css'],
})
export class BlogDetailsComponent implements OnInit {
  blogDetail: any = [];
  currentUser:any

  messageErr = '';
  role : any
  constructor(
    private usersService: AdminService,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute, 
    private http: HttpClient,
    private Auth :AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.Auth.getRole();
    this.currentUser = this.auth.getcurrentuser();



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

  onReact(blogDetail: any, reaction: string) {
    const apiUrl = `http://localhost:3000/api/v1/blogs/${blogDetail.id}/blog_reactions`;
    const payload = {
      user_id: this.currentUser.id, // Replace with the actual user ID
      reaction: reaction
    };
  
    // Call the API
    this.http.post(apiUrl, payload).subscribe(
      (response: any) => {
        // Update counts based on the response
        this.blogDetail.likes_count = response.likes;
        this.blogDetail.dislikes_count = response.dislikes;
  
        console.log(response.message); // Reaction saved or error message
      },
      (error) => {
        this.toastr.error(error.error.message , 'Oops...');

      }
    );
  }
  
}
