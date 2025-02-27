import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  public connecte: boolean = false;
  messageError: any;
  currentUser: any;
  role:any
  // Define the form group with validation
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),  // Email field with required and email format validation
    password: new FormControl('', [Validators.required, Validators.minLength(6)])  // Password field with required and min length validation
  });

  constructor(private Auth: AuthService, private route: Router, private actrou: ActivatedRoute, private toastr: ToastrService, private translate: TranslateService) {
    this.currentUser = this.Auth.getcurrentuser();
    this.role = this.Auth.getRole();

  }

  ngOnInit(): void {
    this.actrou.queryParams.subscribe(params => {
      const state = history.state;
      if (state?.message) {
        this.toastr.error(state.message, 'Access Denied'); // Show toaster notification
      }
    });
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
      this.route.navigate([userTypes[this.role]]);
    } else {
      this.toastr.error('Access denied. Please contact support.');
    }
  }

  // Login method
  login() {
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill out the form correctly.'
      });
      return;
    }
  
    // Non-null assertion operator (!) to ensure the controls exist
    const data = {
      user: {
        email: this.registerForm.get('email')!.value,  // Use `!` to assert that it's not null
        password: this.registerForm.get('password')!.value  // Use `!` to assert that it's not null
      }
    };
  
    this.Auth.login(data).subscribe(
      (response: any) => {
        if (response.status === 401) {
          this.showError('User Not Found Or Invalid Credentials');
        } else if (response.user.email_confirmed) {
          this.handleLoginSuccess(response);
        } else {
          this.showError('Account created but not confirmed! Check your email.');
        }
      },
      (error: HttpErrorResponse) => {
        this.messageError = error.error;
        this.showError('An error occurred. Please try again.');
      }
    );
  }
  

  // Handle successful login
  private handleLoginSuccess(response: any): void {
    const { logged_in, type, user, token } = response;
    const userTypes: { [key: string]: string } = {
      'Admin': 'admin/dashboard',
      'Doctor': 'doctor/dashboard',
      'Patient': 'patient/dashboard'
    };

    if (logged_in && userTypes[type]) {
      sessionStorage.setItem(`${type.toLowerCase()}data`, JSON.stringify(user));
      sessionStorage.setItem('access_token', token);
      sessionStorage.setItem('user_type', type);
      this.toastr.success('Vous êtes maintenant connecté.');
      this.translate.use(user.language);
      this.route.navigate([userTypes[type]]);
    } else {
      this.showError('Email or Password is incorrect!');
    }
  }

  // Show error with SweetAlert
  private showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message
    });
  }
}
