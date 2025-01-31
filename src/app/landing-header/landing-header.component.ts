import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.css']
})
export class LandingHeaderComponent implements OnInit {
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
