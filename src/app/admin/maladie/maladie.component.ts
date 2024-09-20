import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maladie',
  templateUrl: './maladie.component.html',
  styleUrls: ['./maladie.component.css']
})
export class MaladieComponent implements OnInit {
  maladies: any = [];
  update!: FormGroup;
  messageErr = '';
  dataMaladie: any = {};

  constructor(
    private usersService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    // Initialize the reactive form
    this.update = new FormGroup({
      maladie_name: new FormControl('', [Validators.required]),
      causes: new FormControl(''),
      maladie_description: new FormControl('', [Validators.required]),
      symptoms: new FormControl(''),
      synonyms: new FormControl(''),
      prevention: new FormControl(''),
      treatments: new FormControl(''),
      references: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.usersService.getAllIAdiseas().subscribe(
      (data) => {
        this.maladies = data;
        console.log(this.maladies);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We couldn't find this blog in our database.";
      }
    );
  }

  // Populate the form with the selected maladie data
  getdata(maladie: any) {
    this.dataMaladie = maladie;

    // Update the form controls with the maladie data
    this.update.patchValue({
      maladie_name: maladie.maladie_name,
      causes: maladie.causes,
      maladie_description: maladie.maladie_description,
      symptoms: maladie.symptoms,
      synonyms: maladie.synonyms,
      prevention: maladie.prevention,
      treatments: maladie.treatments,
      references: maladie.references
    });
  }

  // Submit the updated data
  updateMaladie() {
    if (this.update.valid) {
      // You can also add more properties if necessary
      const updatedMaladie = this.update.value;

      // Patch request to the backend
      this.usersService.updateDiseas({ ...updatedMaladie, id: this.dataMaladie.id }).subscribe(() => {
        this.toastr.success('Disease updated successfully!', 'Update Success!');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }, (err: HttpErrorResponse) => {
        this.messageErr = err.error;
        this.toastr.error('Failed to update disease.', 'Update Failed!');
      });
    } else {
      this.toastr.error('Please fill out all required fields.', 'Form Error');
    }
  }
}
