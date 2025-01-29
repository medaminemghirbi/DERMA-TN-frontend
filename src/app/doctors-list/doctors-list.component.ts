import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {
  currentUser: any;
  role: string | null;
  isLoading: boolean = false;
  doctors:any = []
  filteredDoctors:any = []
  locations: any = [];
  selectedLocation: string = ''; // Selected Gouvernement
  searchedKeyword: string = '';
  p:number = 1 ;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 25, 50, 100];
  constructor(
    private usersService: AdminService,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService // Inject ToastrService
  ) { 
    this.currentUser = this.auth.getcurrentuser();
    this.role = this.auth.getRole();
    
  }

  async ngOnInit(): Promise<void> {
    this.loadDoctors()
    this.locations = await this.usersService.getAllLocations().toPromise();

  }

  goToDashboard(): void {
    const userTypes: { [key: string]: string } = {
      'Admin': 'admin/dashboard',
      'Doctor': 'doctor/dashboard',
      'Patient': 'patient/dashboard'
    };

    // Navigate based on the role if it exists in userTypes
    if (this.role && userTypes[this.role]) {
      this.toastr.success('Welcome back!');
      this.router.navigate([userTypes[this.role]]);
    } else {
      this.toastr.error('Access denied. Please contact support.');
    }
  }
  loadDoctors(): void {
    this.isLoading = true;
    this.usersService.getDoctorsIndex().subscribe(data => {
      this.doctors = data;
      console.log(this.doctors)
      this.filteredDoctors = data;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
  }
  extractLocations() {
    const uniqueLocations = new Set(this.doctors.map((doctor: { government: any; }) => doctor.government));
    this.locations = Array.from(uniqueLocations).sort();
  }
  generateStars(totalRating: number, ratingCount: number): { filled: boolean }[] {
    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(averageRating)) {
        stars.push({ filled: true });  // Full star
      } else if (i === Math.ceil(averageRating) && averageRating % 1 !== 0) {
        stars.push({ filled: true, partial: true }); // Partial star
      } else {
        stars.push({ filled: false });  // Empty star
      }
    }
    return stars;
  }

  searchDoctors(): void {
    const trimmedKeyword = this.searchedKeyword ? this.searchedKeyword.trim() : '';
    debugger
    if (trimmedKeyword) {
      this.filteredDoctors = this.doctors.filter((doctor: { firstname: string, location: string, lastname: string }) => {
        const firstNameMatches = doctor.firstname && doctor.firstname.toLowerCase().includes(trimmedKeyword.toLowerCase());
        const lastNameMatches = doctor.lastname && doctor.lastname.toLowerCase().includes(trimmedKeyword.toLowerCase());
        const locationMatches = doctor.location && doctor.location.toLowerCase().includes(trimmedKeyword.toLowerCase());
        
        return firstNameMatches || lastNameMatches || locationMatches;
      });
    } else {
      this.filteredDoctors = [...this.doctors];
    }
    this.p = 1;
  }

  searchDoctorsbylocation() {
    this.p = 1;
    this.filteredDoctors = this.doctors.filter((doctor: { location: string; }) => {
        return !this.selectedLocation || doctor.location === this.selectedLocation;
    });
}

resetFilters(): void {
  this.isLoading = true; // Show loading indicator

  setTimeout(() => {
    this.searchedKeyword = '';
    this.selectedLocation = '';
    this.filteredDoctors = [...this.doctors];
    this.p = 1; // Reset pagination
    this.isLoading = false; // Hide loading indicator after reset
  }, 500); // Adjust the delay as needed (500ms = 0.5s)
}


}
