import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-map-picker',
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.css'],
})
export class MapPickerComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: google.maps.Map;
  latitude: number = 0;
  longitude: number = 0;
  marker!: google.maps.Marker;
  currenUser: any;
  update!: FormGroup;

  // Default location in Tunisia (center if no lat/long or address)
  defaultLocation = { lat: 34.0, lng: 9.0 }; // Center of Tunisia

  constructor(private auth: AuthService, private userService: DoctorService) {
    this.currenUser = this.auth.getcurrentuser();
    this.update = new FormGroup({
      latitude: new FormControl(''),
      longitude: new FormControl(''),
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loadMap();
  }

  loadMap() {
    const geocoder = new google.maps.Geocoder();
    this.currenUser = this.auth.getcurrentuser();

    // Check if the currentUser has latitude/longitude
    if (this.currenUser.latitude && this.currenUser.longitude) {
      this.latitude = parseFloat(this.currenUser.latitude);
      this.longitude = parseFloat(this.currenUser.longitude);
    } else if (this.currenUser.address) {
      // If no lat/long, use the address to set the marker
      geocoder.geocode({ address: this.currenUser.address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const addressLatLng = results![0].geometry.location;
          this.latitude = addressLatLng.lat();
          this.longitude = addressLatLng.lng();
        } else {
          console.error('Geocode failed: ' + status);
          this.setDefaultMarker();
        }
        this.initMap(); // Initialize map after geocoding
      });
      return; // Exit since we're waiting on geocode
    } else if (this.currenUser.location) {
      // If no lat/long and no address, use the location (e.g., gouvernament of Tunisia)
      geocoder.geocode({ address: this.currenUser.location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const locationLatLng = results![0].geometry.location;
          this.latitude = locationLatLng.lat();
          this.longitude = locationLatLng.lng();
        } else {
          console.error('Geocode failed: ' + status);
          this.setDefaultMarker();
        }
        this.initMap(); // Initialize map after geocoding
      });
      return; // Exit since we're waiting on geocode
    } else {
      this.setDefaultMarker(); // No lat/long, address, or location, set default marker
    }

    this.initMap(); // Initialize the map when lat/long or default is set
  }

  initMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 15,
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    // Set the initial marker
    this.setMarker({ lat: this.latitude, lng: this.longitude });

    // Add click event listener to map to update the marker
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.showLocationConfirmation(event.latLng);
      }
    });
  }

  setMarker(location: google.maps.LatLngLiteral) {
    // Remove existing marker if it exists
    if (this.marker) {
      this.marker.setMap(null);
    }

    // Create a new marker at the specified location
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
    });

    // Update latitude and longitude in the form
    this.latitude = location.lat;
    this.longitude = location.lng;
    this.update.patchValue({
      latitude: this.latitude,
      longitude: this.longitude,
    });
  }

  setDefaultMarker() {
    this.latitude = this.defaultLocation.lat;
    this.longitude = this.defaultLocation.lng;
    this.initMap();
  }

  showLocationConfirmation(location: google.maps.LatLng) {
    Swal.fire({
      title: 'Update Location?',
      text: 'Are you sure you want to update your location?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.setMarker(location.toJSON());
        this.updateUserLocation();
      }
    });
  }

  updateUserLocation() {
    const formData = new FormData();
    formData.append('latitude', String(this.latitude));
    formData.append('longitude', String(this.longitude));

    // Call the service to update the location
    this.userService.update_location(this.currenUser.id, formData).subscribe(
      response => {
        sessionStorage.setItem('doctordata', JSON.stringify(response));
        Swal.fire('Location updated!', '', 'success');
      },
      error => {
        console.error('Error updating location:', error);
        Swal.fire('Failed to update location', 'Please try again.', 'error');
      }
    );
  }
}
