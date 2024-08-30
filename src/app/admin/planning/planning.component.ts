import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ReportsService } from 'src/app/services/pdf/reports.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent   implements OnInit {
  locations:any = []
  doctors:any = []

  p:number = 1 ;
  searchedKeyword!:string;
  messageErr: string = '';
  selectedLocation: string = "";
  selectedDoctorId: string = '';  // Holds the ID of the selected doctor
  doctorAppointements: any;
  counter:any
  selectedDoctorName!: string;
  message!:string;
  data_demande={
    id : '',
    status:'',
    refus_reason : ''
  }
  constructor(private usersService: AdminService, private route: Router, private pdfService: ReportsService) {
  }


  async ngOnInit(): Promise<void> {
    try {
      this.locations = await this.usersService.getAllLocations().toPromise();
      console.log(this.locations);
    } catch (error) {
      this.messageErr = "We couldn't find any locations in our database.";
    }
  }

  getDoctorsByLocation(location: string): void {
    this.selectedLocation = location;
    console.log("Selected Location:", this.selectedLocation);

    if (this.selectedLocation) {
      this.usersService.getDoctorsByLocation(this.selectedLocation).subscribe(
        (data) => {
          this.selectedDoctorName = '';
          this.doctorAppointements = null;
          this.doctors = data;
          if (this.doctors.length === 0) {
            this.doctorAppointements = null;
            this.message="No doctors available for the selected location.";
          }
          console.log("Doctors List:", this.doctors);
        },
        (err: HttpErrorResponse) => {
          console.error("Error fetching doctors:", err);
          this.doctors = [];
        }
      );
    } else {
      this.doctors = [];
    }
  }

  onDoctorChange(doctor_id: string): void {
    this.selectedDoctorId = doctor_id;
    console.log("Selected Doctor ID:", this.selectedDoctorId);

    if (this.selectedDoctorId) {
      this.usersService.getDoctorDetails(this.selectedDoctorId).subscribe(
        (data) => {
          this.doctorAppointements = null;
          this.doctorAppointements = data;
          if (data.length > 0) {
            const doctor = data[0].doctor;
            this.selectedDoctorName = `Dr. ${doctor.firstname} ${doctor.lastname}`;
          } else {
            this.selectedDoctorName = '';
          }
          console.log("Doctor Details:", this.doctorAppointements);
        },
        (err: HttpErrorResponse) => {
          console.error("Error fetching doctor details:", err);
          this.doctorAppointements = null;
          this.selectedDoctorName = '';
        }
      );
    } else {
      this.doctorAppointements = null;
      this.selectedDoctorName = '';
    }
  }

  downloadPDF(item: any) {
    this.pdfService.generatePDF([item]); // Pass the selected item or items
  }

  delete(id: any, i: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Archive it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.ArchiverAppointement(id).subscribe(
          response => {
            this.doctorAppointements.splice(i, 1);
            Swal.fire(
              'Deleted!',
              'Contract type has been Archived.',
              'success'
            );
          },
        );
      }
    });
  }
}