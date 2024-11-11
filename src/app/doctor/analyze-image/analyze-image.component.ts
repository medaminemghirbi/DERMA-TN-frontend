import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-analyze-image',
  templateUrl: './analyze-image.component.html',
  styleUrls: ['./analyze-image.component.css'],
})
export class AnalyzeImageComponent implements OnInit {
  currentuser: any;

  image: any;
  imageupdate: FormGroup;
  loading: boolean = false;
  result: any = null; // To hold the API response
  imageUrl: string | ArrayBuffer | null = null; // To hold the image data URL for display

  constructor(private doctorService: DoctorService, private Auth: AuthService, private toastr: ToastrService  ) {
    this.currentuser = this.Auth.getcurrentuser();

    this.imageupdate = new FormGroup({
      file: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  fileChange(event: any) {
    const input = event.target as HTMLInputElement;
    const allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
    
    if (input.files && input.files[0]) {
      this.image = input.files[0]; // Get the selected file
      
      // Check if the file type is allowed
      if (!allowedExtensions.includes(this.image.type)) {
        this.image = null;          // Reset the image property
        input.value = '';            // Clear the input field
        this.toastr.error('Please provide only .png or .jpg images!', 'Error Loading Image!');
        return;
      }
      
      // If the file is valid, read it for display
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result; // Set the image URL for display
      };
      reader.readAsDataURL(this.image);
    }
  }
  

  updateimage(f: any) {
    let data = f.value;
    const imageformadata = new FormData();
    imageformadata.append('file', this.image);

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true; // Show loading indicator
        this.doctorService.analyzeImage(imageformadata, this.currentuser.id ).subscribe(
          (response) => {
            this.result = response; // Save API response
            this.loading = false; // Hide loading indicator
          },
          (err: HttpErrorResponse) => {
            this.loading = false; // Hide loading indicator
            Swal.fire('Error!', err.error.error + '<br>'+'Contact: superadmin@example.com', 'error');
          }
        );
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

  loadDeepLearningNumber(){
    this.doctorService.loadPlan(this.currentuser.id ).subscribe(
      (response) => {
        this.result = response; // Save API response
        this.loading = false; // Hide loading indicator
      },
      (err: HttpErrorResponse) => {
        this.loading = false; // Hide loading indicator
        Swal.fire('Error!', err.error.error + '<br>'+'Contact: superadmin@example.com', 'error');
      }
    );
  }
}
