import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-settings',
  templateUrl: './doctor-settings.component.html',
  styleUrls: ['./doctor-settings.component.css'],
})
export class DoctorSettingsComponent implements OnInit {
  addressLine1: string = '';
  city: string = '';
  state: string = '';
  postalCode: string = '';
  image: any;
  imageupdate!: any;
  upadate! :  FormGroup;

  messageSuccess =""
  country: string = '';
  currentUser: any;
  currentUserLocation = {
    address: '',
    zipCode: '',
    city: '',
  };
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private doctorService: DoctorService
  ) {
    this.imageupdate = new FormGroup({
      avatar: new FormControl('', [Validators.required]),
    });
    this.upadate = new FormGroup({
      civil_status: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.currentUser = this.auth.getcurrentuser();
    this.autoFillAddress();
    this.extractAddressDetails(this.currentUser.address);
  }

  autoFillAddress() {
    const latitude = this.currentUser?.latitude;
    const longitude = this.currentUser?.longitude;

    // Check if both latitude and longitude exist
    if (latitude && longitude) {
      this.http
        .get<any>(
          `http://localhost:3000/api/v1/location_details?latitude=${latitude}&longitude=${longitude}`
        )
        .subscribe(
          (data) => {
            // Safe navigation for 'data'
            this.addressLine1 = data?.address;
          },
          (error) => {
            console.error('Error fetching location details:', error);
          }
        );
    }
  }

  extractAddressDetails(address: string | undefined) {
    // Use optional chaining to prevent splitting if address is undefined
    const addressParts = address?.split(',');

    if (addressParts && addressParts.length >= 3) {
      const zipCode = addressParts[addressParts.length - 2]?.trim();
      const city = addressParts[addressParts.length - 3]?.trim();

      // Safely assign values if they exist
      this.currentUserLocation.zipCode = zipCode || '';
      this.currentUserLocation.city = city || '';
    }
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

  updateadminprofil (f:any){
    let data=f.value
    const formData = new FormData();
    formData.append('website', this.upadate.value.website);



    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
    this.doctorService.updatedoctorprofil(this.currentUser.id,formData).subscribe(
      (response) => {
        sessionStorage.setItem('doctordata', JSON.stringify(response));
        window.location.reload();
      },
      (err: HttpErrorResponse) => {})
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  updateinformations(f:any){
    let data=f.value
    const formData = new FormData();
    formData.append('gender', this.upadate.value.gender);
    formData.append('civil_status', this.upadate.value.civil_status);
    formData.append('birthday', this.upadate.value.birthday);


    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
    this.doctorService.updatedoctorinformations(this.currentUser.id,formData).subscribe(
      (response) => {
        sessionStorage.setItem('doctordata', JSON.stringify(response));
        window.location.reload();
      },
      (err: HttpErrorResponse) => {})
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

}
