import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DoctorService } from '../services/doctor.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-map-picker',
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.css']
})
export class MapPickerComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map!: google.maps.Map;
  latitude: number = 0;
  longitude: number = 0;
  marker!: google.maps.Marker;
  currenUser: any;
  isLocationUpdated: boolean = false; // Flag to track if location has been updated
  update!: FormGroup;

  constructor(private changeDetectorRef: ChangeDetectorRef, private auth: AuthService, private userService: DoctorService) {
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
    // Retrieve the current user
    this.currenUser = this.auth.getcurrentuser();
    
    // Check if currentUser has valid latitude and longitude
    const userLatLng = this.currenUser && this.currenUser.latitude && this.currenUser.longitude 
      ? { lat: this.currenUser.latitude, lng: this.currenUser.longitude } 
      : { lat: 35.8283971, lng: 10.5768549 }; // Default location if no valid location exists
  
    const mapOptions: google.maps.MapOptions = {
      center: userLatLng,
      zoom: 15,
    };
  
    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
  
    // Set a marker at the user's location
    this.setMarker(userLatLng); // Set marker from currentUser
  
    // Add click event listener to map
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.showLocationConfirmation(event.latLng);  // Show confirmation before setting marker
      }
    });
  }
  
  showLocationConfirmation(location: google.maps.LatLng | google.maps.LatLngLiteral) {
    // Check if the new location is different from the current one
    const newLatitude = location.lat instanceof Function ? location.lat() : location.lat;
    const newLongitude = location.lng instanceof Function ? location.lng() : location.lng;

    if (this.latitude === newLatitude && this.longitude === newLongitude) {
      Swal.fire({
        title: 'Location Unchanged',
        text: 'You have selected the same location. No changes will be made.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return; // Exit if the location hasn't changed
    }

    // Prompt user for confirmation before updating location
    Swal.fire({
      title: 'Update Location?',
      text: 'Are you sure you want to update your location?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.setMarker(location); // Set marker and update lat/lng
      }
    });
  }
  
  setMarker(location: google.maps.LatLng | google.maps.LatLngLiteral) {
    // Remove existing marker if it exists
    if (this.marker) {
      this.marker.setMap(null);
    }

    // Create a new marker at the clicked location
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
    });

    // Update latitude and longitude from the clicked location
    this.latitude = location.lat instanceof Function ? location.lat() : location.lat;
    this.longitude = location.lng instanceof Function ? location.lng() : location.lng;

    // Create FormData and append latitude and longitude
    const formData = new FormData();
    formData.append('latitude', String(this.latitude)); // Convert to string
    formData.append('longitude', String(this.longitude)); // Convert to string

    // Update the currentUser's location if not already updated
      // Call the service to update the location
      this.userService.update_location(this.currenUser.id, formData).subscribe(
        response => {
          sessionStorage.setItem('doctordata', JSON.stringify(response));
          // Set the flag to true after updating
          this.isLocationUpdated = true;
          
        },
        error => {
          console.error('Error updating user location:', error);
          // Handle the error appropriately (e.g., show a notification to the user)
        }
      );

    // Manually trigger change detection to update the view
    this.changeDetectorRef.detectChanges();
  }
}
