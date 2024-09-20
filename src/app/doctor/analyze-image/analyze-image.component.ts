import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private doctorService: DoctorService,     private Auth: AuthService  ) {
    this.currentuser = this.Auth.getcurrentuser();

    this.imageupdate = new FormGroup({
      file: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  fileChange(event: any) {
    this.image = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result; // Set the image URL for display
    };
    reader.readAsDataURL(this.image);
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
}
