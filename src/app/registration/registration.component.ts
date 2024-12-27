import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  locations: any = [];
  messageErr = '';
  registrationForm!: FormGroup;

  constructor(private usersService: AdminService, private fb: FormBuilder, private auth: AuthService) {
    this.createForm();
  }

  async ngOnInit(): Promise<void> {
    try {
      this.locations = await this.usersService.getAllLocations().toPromise();
      this.locations.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch (error) {
      this.messageErr = "We couldn't find any locations in our database.";
    }
  }

  createForm() {
    this.registrationForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required],
        type: ['', Validators.required],
        gender: ['', Validators.required],
        location: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator } // Apply custom validator here
    );
  }

  // Custom validator to check if password and confirmation match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const password_confirmation = control.get('password_confirmation')?.value;

    if (password !== password_confirmation) {
      return { passwordMismatch: true };
    }
    return null; // No error
  }

  // Mark the onSubmit method as async
  async onSubmit() {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      const userData = {
        registration: {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          type: formData.type,
          gender: formData.gender,

          location: formData.location,
        },
      };

      // Disable register button and show loading spinner
      let registerButton = document.getElementById('registerButton') as HTMLButtonElement;
      registerButton.disabled = true;
      registerButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

      try {
        const response = await this.auth.register(userData).toPromise();
        this.messageErr = '';

        Swal.fire('Whooa!', 'Account successfully created. Activate your email to access your account profile!', 'success').then(() => {
          registerButton.disabled = false;
          registerButton.innerHTML = 'Register';
        });
      } catch (error) {
        console.log(error);

        // Enable the register button if there's an error
        registerButton.disabled = false;
        registerButton.innerHTML = 'Register';

        if (error instanceof HttpErrorResponse) {
          this.messageErr = 'Email is already taken';
        } else {
          this.messageErr = 'An error occurred. Please try again later.';
        }
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
