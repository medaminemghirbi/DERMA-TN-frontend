import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
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
  isLocationUpdated: boolean = false; // Flag to track if location has been updated
  update!: FormGroup;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private auth: AuthService,
    private userService: DoctorService
  ) {
    this.currenUser = this.auth.getcurrentuser();
    this.update = new FormGroup({
      latitude: new FormControl(''),
      longitude: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.initializeMarkerFromSession(); // Initialize marker on component load
    this.loadMap();
  }

  ngAfterViewInit(): void {
    this.loadMap();
  }

  loadMap() {
    // Retrieve the current user
    this.currenUser = this.auth.getcurrentuser();
    const geocoder = new google.maps.Geocoder();

    // Ensure currentUser has an address
    if (this.currenUser && this.currenUser.address) {
      geocoder.geocode(
        { address: this.currenUser.address },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const addressLatLng = results![0].geometry.location;

            const mapOptions: google.maps.MapOptions = {
              center: addressLatLng,
              zoom: 15,
            };

            this.map = new google.maps.Map(
              this.mapContainer.nativeElement,
              mapOptions
            );

            // Set a marker at the geocoded address
            this.initializeMarkerFromSession();

            // Add click event listener to map
            this.map.addListener(
              'click',
              (event: google.maps.MapMouseEvent) => {
                if (event.latLng) {
                  this.showLocationConfirmation(event.latLng); // Show confirmation before setting marker
                }
              }
            );
          } else {
            console.error(
              'Geocode was not successful for the following reason: ' + status
            );
          }
        }
      );
    } else {
      console.error('No valid address found for the current user.');
    }
  }
  showLocationConfirmation(
    location: google.maps.LatLng | google.maps.LatLngLiteral
  ) {
    // Check if the new location is different from the current one
    const newLatitude =
      location.lat instanceof Function ? location.lat() : location.lat;
    const newLongitude =
      location.lng instanceof Function ? location.lng() : location.lng;

    if (this.latitude === newLatitude && this.longitude === newLongitude) {
      Swal.fire({
        title: 'Location Unchanged',
        text: 'You have selected the same location. No changes will be made.',
        icon: 'info',
        confirmButtonText: 'OK',
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
      confirmButtonText: 'Yes, update it!',
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
    this.latitude =
      location.lat instanceof Function ? location.lat() : location.lat;
    this.longitude =
      location.lng instanceof Function ? location.lng() : location.lng;

    // Create FormData and append latitude and longitude
    const formData = new FormData();
    formData.append('latitude', String(this.latitude)); // Convert to string
    formData.append('longitude', String(this.longitude)); // Convert to string

    // Update the currentUser's location if not already updated
    // Call the service to update the location
    this.userService.update_location(this.currenUser.id, formData).subscribe(
      (response) => {
        sessionStorage.setItem('doctordata', JSON.stringify(response));
        // Set the flag to true after updating
        this.isLocationUpdated = true;
      },
      (error) => {
        console.error('Error updating user location:', error);
        // Handle the error appropriately (e.g., show a notification to the user)
      }
    );

    // Manually trigger change detection to update the view
    this.changeDetectorRef.detectChanges();
  }

  initializeMarkerFromSession() {
    const storedDoctorData = sessionStorage.getItem('doctordata');
    if (storedDoctorData) {
      const doctorData = JSON.parse(storedDoctorData);
      const storedLatitude = doctorData.latitude; // Assuming latitude is a property in doctordata
      const storedLongitude = doctorData.longitude; // Assuming longitude is a property in doctordata
      const storedLocation = doctorData.location; // Assuming location is a property in doctordata

      // Check if both latitude and longitude are available
      if (storedLatitude && storedLongitude) {
        const storedLatLng = {
          lat: parseFloat(storedLatitude),
          lng: parseFloat(storedLongitude),
        };

        // Set marker using stored coordinates
        this.setMarker(storedLatLng);
        return; // Exit the function after setting the marker
      }

      // If latitude and longitude are not available, check for location
      if (storedLocation) {
        const geocoder = new google.maps.Geocoder();

        // Geocode the location string
        geocoder.geocode({ address: storedLocation }, (results, status) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results.length > 0
          ) {
            const location = results[0].geometry.location;
            const latLng = {
              lat: location.lat(),
              lng: location.lng(),
            };

            // Set the marker using the geocoded location
            this.setMarker(latLng);
          } else {
            console.error('Geocoding failed: ' + status);
          }
        });
      }
    } else {
      console.warn('No doctor data found in session storage.');
    }
  }
}
