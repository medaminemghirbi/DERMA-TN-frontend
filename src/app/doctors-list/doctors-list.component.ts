import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for API calls

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {
  currentUser: any;
  role: string | null;
  isLoading: boolean = false;
  filteredDoctors: any = [];
  locations: any = [];
  selectedLocation: string = ''; // Selected Gouvernement
  searchedKeyword: string = '';
  p: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions: number[] = [5, 25, 50, 100];

  constructor(
    private usersService: AdminService,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService, // Inject ToastrService
    private http: HttpClient // Inject HttpClient
  ) {
    this.currentUser = this.auth.getcurrentuser();
    this.role = this.auth.getRole();
  }

  async ngOnInit(): Promise<void> {
    this.loadDoctors();
    this.locations = await this.usersService.getAllLocations().toPromise();
  }

  goToDashboard(): void {
    const userTypes: { [key: string]: string } = {
      'Admin': 'admin/dashboard',
      'Doctor': 'doctor/dashboard',
      'Patient': 'patient/dashboard'
    };

    if (this.role && userTypes[this.role]) {
      this.toastr.success('Welcome back!');
      this.router.navigate([userTypes[this.role]]);
    } else {
      this.toastr.error('Access denied. Please contact support.');
    }
  }

  loadDoctors(): void {
    this.http.get<any>(`http://localhost:3000/api/v1/search_doctors?location=${this.selectedLocation}&query=${this.searchedKeyword}`)
      .subscribe(data => {
        this.filteredDoctors = data;
        console.log(this.filteredDoctors)
      }, error => {
        this.toastr.error('Failed to load doctors');
      });
  }

  extractLocations() {
    const uniqueLocations = new Set(this.filteredDoctors.map((doctor: { government: any; }) => doctor.government));
    this.locations = Array.from(uniqueLocations).sort();
  }

  generateStars(totalRating: number, ratingCount: number): { filled: boolean }[] {
    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(averageRating)) {
        stars.push({ filled: true });
      } else if (i === Math.ceil(averageRating) && averageRating % 1 !== 0) {
        stars.push({ filled: true, partial: true });
      } else {
        stars.push({ filled: false });
      }
    }
    return stars;
  }

  searchDoctors(): void {
    this.loadDoctors(); 
    this.p = 1;
  }

  searchDoctorsbylocation() {
    this.p = 1;
    this.loadDoctors();
  }

  resetFilters(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.searchedKeyword = '';
      this.selectedLocation = '';
      this.loadDoctors();
      this.p = 1;
      this.isLoading = false;
    }, 500);
  }
}
