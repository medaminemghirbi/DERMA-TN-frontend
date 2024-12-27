import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Make sure to import ToastrService if you are using it

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  currentUser: any;
  role: string | null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService // Inject ToastrService
  ) { 
    this.currentUser = this.auth.getcurrentuser();
    this.role = this.auth.getRole();
  }

  ngOnInit(): void {
    // Optionally, you can add any initialization logic here
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
}
