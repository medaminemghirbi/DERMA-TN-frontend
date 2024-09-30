import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css'],
})
export class SocialMediaComponent implements OnInit {
  upadate!: FormGroup;
  currentUser: any;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private doctorService: DoctorService
  ) {
    this.upadate = new FormGroup({
      website: new FormControl('', [Validators.required]),

      facebook: new FormControl('', [Validators.required]),
      twitter: new FormControl('', [Validators.required]),
      youtube: new FormControl('', [Validators.required]),
      linkedin: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.currentUser = this.auth.getcurrentuser();
  }
  updateadminprofil(f: any) {
    let data = f.value;
    const formData = new FormData();
    formData.append('website', this.upadate.value.website);

    formData.append('facebook', this.upadate.value.facebook);
    formData.append('twitter', this.upadate.value.twitter);
    formData.append('youtube', this.upadate.value.youtube);
    formData.append('linkedin', this.upadate.value.linkedin);

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.doctorService
          .updatedoctorprofil(this.currentUser.id, formData)
          .subscribe(
            (response) => {
              sessionStorage.setItem('doctordata', JSON.stringify(response));
              window.location.reload();
            },
            (err: HttpErrorResponse) => {}
          );
        Swal.fire('Saved!', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
}
