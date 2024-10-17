import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings-patient',
  templateUrl: './settings-patient.component.html',
  styleUrls: ['./settings-patient.component.css'],
})
export class SettingsPatientComponent implements OnInit {
  
  locations: any = [];
  addressLine1: string = '';
  city: string = '';
  state: string = '';
  postalCode: string = '';
  image: any;
  imageupdate!: any;
  upadate!: FormGroup;
  upadate_radius!: FormGroup;

  messageErr = '';
  messageSuccess = '';
  country: string = '';
  currentUser: any;
  currentUserLocation = {
    address: '',
    zipCode: '',
    city: '',
  };
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: google.maps.Map;
  latitude: number = 0;
  longitude: number = 0;
  marker!: google.maps.Marker;
  currenUser: any;
  circle!: google.maps.Circle;

  update!: FormGroup;

  // Default location in Tunisia (center if no lat/long or address)
  defaultLocation = { lat: 34.0, lng: 9.0 }; // Center of Tunisia

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private doctorService: DoctorService,
    private usersService: AdminService
  ) {
    this.imageupdate = new FormGroup({
      avatar: new FormControl('', [Validators.required]),
    });
    this.upadate = new FormGroup({
      civil_status: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
    });
    this.upadate_radius = new FormGroup({
      radius: new FormControl('', [Validators.required]),
    });
    
  }

  async ngOnInit(): Promise<void> {
    this.currentUser = this.auth.getcurrentuser();
    this.autoFillAddress();
    this.extractAddressDetails(this.currentUser.address);
    try {
      this.locations = await this.usersService.getAllLocations().toPromise();
      this.locations.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch (error) {
      this.messageErr = "We couldn't find any locations in our database.";
    }
  }
  ngAfterViewInit(): void {
    
    this.loadMap();
  }

  autoFillAddress() {
    const latitude = this.currentUser?.latitude;
    const longitude = this.currentUser?.longitude;

    // Check if both latitude and longitude exist
    if (latitude && longitude) {
      this.doctorService.getLocationDetails(latitude, longitude).subscribe(
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

  updateadminprofil(f: any) {
    let data = f.value;
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

  updateinformations(f: any) {
    let data = f.value;
    const formData = new FormData();
    formData.append('gender', this.upadate.value.gender);
    formData.append('civil_status', this.upadate.value.civil_status);
    formData.append('birthday', this.upadate.value.birthday);
    formData.append('lastname', this.upadate.value.lastname);
    formData.append('firstname', this.upadate.value.firstname);
    formData.append('location', this.upadate.value.location);

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
          .updatedoctorinformations(this.currentUser.id, formData)
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
  updateradius(f: any) {
    let data = f.value;
    const formData = new FormData();


    formData.append('radius', this.upadate_radius.value.radius);
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
          .updatedoctorinformations(this.currentUser.id, formData)
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
  

  loadMap() {
    const geocoder = new google.maps.Geocoder();
    this.currentUser = this.auth.getcurrentuser();
  
    // Check if user has a location
    if (this.currentUser.location) {
      // If a location is available, geocode it
      geocoder.geocode({ address: this.currentUser.location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const locationLatLng = results![0].geometry.location;
          this.latitude = locationLatLng.lat();
          this.longitude = locationLatLng.lng();
          this.circle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: this.map,
            center: this.defaultLocation,
            radius: 50000, // Adjust as needed
          });
        } else {
          console.error('Geocode failed: ' + status);
          this.setDefaultMarker(); // If geocoding fails, set a default marker
        }
        this.initMap(); // Initialize the map after geocoding
      });
    } else {
      // If no location is provided, fall back to the default marker
      this.setDefaultMarker(); 
    }
  }
  
  initMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 15,
    };
  
    // Initialize the map
    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
  
    // Set the initial marker to the user's current location
    this.setMarker({ lat: this.latitude, lng: this.longitude });
  }
  
  setMarker(location: google.maps.LatLngLiteral) {
    // Remove existing marker if it exists
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.addCircle(this.latitude, this.longitude);

    // Create a new marker at the specified location
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
    });
  }
  
  setDefaultMarker() {
    this.latitude = this.defaultLocation.lat; // Set default latitude
    this.longitude = this.defaultLocation.lng; // Set default longitude
    this.initMap(); // Initialize the map with default coordinates
  }
  addCircle(lat: number, lng: number) {
    // Check if the circle already exists, if so, remove it
    if (this.circle) {
      this.circle.setMap(null);
    }

    // Create a new circle around the location
    this.circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: { lat: lat, lng: lng },
      radius: this.currentUser.radius * 100, // Adjust the radius as needed
    });
  }
}
