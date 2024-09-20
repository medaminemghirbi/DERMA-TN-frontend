import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../model/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent  implements OnInit {
  public connecte : boolean = false ;

  messageError:any

  registerForm =  new FormGroup({
    email:new FormControl(),
    password:new FormControl()
  })

  user : User ={
    email:'',
    password:'',
  }

  constructor(private Auth:AuthService,private route:Router,     private toastr: ToastrService) { }

  ngOnInit(): void {
  }
  login() {
    const data = {
      user :{
        email:this.user.email,
        password:this.user.password,
      }


    };
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill out the form correctly.'
      });
      return;
    }

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
        console.log(error)
        this.showError('An error occurred. Please try again.');
      }
    );
  }

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
      this.route.navigate([userTypes[type]]);
    } else {
      this.showError('Email or Password is incorrect!');
    }
  }

  private showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message
    });
  }
}