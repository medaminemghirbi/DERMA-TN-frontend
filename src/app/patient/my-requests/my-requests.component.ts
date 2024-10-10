import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  locations: any = [];
  doctors: any = [];

  messageErr=""
  searchedKeyword =""
  p:number = 1 ;
  selectedLocation: string = "";
  selectedDoctorId: string = '';
  selectedDoctorName!: string;
  message =""
  constructor(private usersService: AdminService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.locations = await this.usersService.getAllLocations().toPromise();
      this.locations.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch (error) {
      this.messageErr = "We couldn't find any locations in our database.";
    }
  }


  getDoctorsByLocation(location: string): void {
    this.selectedLocation = location;
    debugger
    console.log("Selected Location:", this.selectedLocation);
    this.selectedDoctorName = '';
    this.selectedDoctorId = '';  // Reset selected doctor
  
    if (this.selectedLocation) {
      this.usersService.getDoctorsByLocation(this.selectedLocation).subscribe(
        (data) => {
          debugger
          this.selectedDoctorName = '';
          this.doctors = data;
    
          // Sort doctors safely
          this.doctors.sort((a: any, b: any) => {
            const nameA = a.name || ''; // Default to empty string if undefined
            const nameB = b.name || ''; // Default to empty string if undefined
            return nameA.localeCompare(nameB);
          });
    
          if (this.doctors.length === 0) {
            this.message = "No doctors available for the selected location.";
          }
          console.log("Doctors List:", this.doctors);
        },
        (err: HttpErrorResponse) => {
          console.error("Error fetching doctors:", err);
          this.doctors = [];
        }
      );
    }else {
      this.doctors = [];
      this.selectedDoctorName = '';
    }
  }
  
}
