import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DoctorService } from 'src/app/services/doctor.service';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-doctor-blogs',
  templateUrl: './doctor-blogs.component.html',
  styleUrls: ['./doctor-blogs.component.css']
})
export class DoctorBlogsComponent implements OnInit {
  blogForm: FormGroup;
  messageErr = "";
  allMaladies: any;
  p:number = 1 ;
  allBlogs: any = [];
  myBlogs: any = [];

  constructor( private usersService :AdminService,private doctorService: DoctorService, private fb: FormBuilder, private auth:AuthService) { 
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      maladieId: ['', Validators.required],
      images: [null]
    });
  }

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

    this.doctorService.getAllMaladie().subscribe(
      (data) => {
        this.allMaladies = data;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We couldn't find any diseases.";
      }
    );

    this.usersService.getMyBlogs(this.auth.getcurrentuser()?.id).subscribe(
      (data) => {
        this.myBlogs = data;
        console.log(this.myBlogs)
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We couldn't find any diseases.";
      }
    );
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    const files: File[] = Array.from(fileList);
    this.blogForm.patchValue({ images: files });
  }

  onSubmit() {
    const doctor_id = this.auth.getcurrentuser()?.id;
    if (this.blogForm.valid) {
      const formData = new FormData();
      formData.append('title', this.blogForm.get('title')?.value);
      formData.append('content', this.blogForm.get('content')?.value);
      formData.append('maladie_id', this.blogForm.get('maladieId')?.value);
      formData.append('doctor_id', doctor_id);

      // Append all images to form data
      const images = this.blogForm.get('images')?.value;
      for (let image of images) {
        formData.append('images[]', image);
      }

      this.doctorService.createBlog(formData).subscribe(
        (response) => {
          window.location.reload()
          console.log('Blog created successfully', response);
          // Handle successful blog creation (e.g., redirect or show success message)
        },
        (error: HttpErrorResponse) => {
          console.error('Error creating blog', error);
          this.messageErr = 'There was an error creating the blog post.';
        }
      );
    } else {
      this.messageErr = 'Please fill in all required fields.';
    }
  }
}
