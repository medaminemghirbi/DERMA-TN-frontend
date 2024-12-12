import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-image',
  templateUrl: './change-image.component.html',
  styleUrls: ['./change-image.component.css']
})
export class ChangeImageComponent implements OnInit {
  imageupdate!: any;
  image: any;
  currentUser :any
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private doctorService: DoctorService,
    private usersService: AdminService
  ) { 
    this.currentUser = this.auth.getcurrentuser();
    this.imageupdate = new FormGroup({
      avatar: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
  }
  fileChange(event: any) {
    this.image = event.target.files[0];
    debugger;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.currentUser.user_image_url = e.target.result;
    };
    reader.readAsDataURL(this.image);
  }
  updateimage(f: any) {
    let data = f.value;
    const imageformadata = new FormData();
    imageformadata.append('avatar', this.image);
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log(data);

        this.doctorService
          .updatedoctorimage(this.currentUser.id, imageformadata)
          .subscribe(
            (response) => {
              sessionStorage.setItem('doctordata', JSON.stringify(response));
              window.location.reload();
            },
            (err: HttpErrorResponse) => {}
          );
        //   this.route.navigate(['/dashbord-freelancer']);
        Swal.fire('Saved!', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }

}
