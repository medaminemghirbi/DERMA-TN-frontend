import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-services',
  templateUrl: './doctor-services.component.html',
  styleUrls: ['./doctor-services.component.css']
})
export class DoctorServicesComponent implements OnInit {
  // services: Service[] = [
  //   { name: "Consultation dermatologique", description: "Examen et diagnostic de la peau.", price: "50 - 100 TND" },
  //   { name: "Peeling chimique", description: "Exfoliation de la peau pour rajeunissement.", price: "120 - 300 TND" },
  //   { name: "Traitement de l'acné", description: "Solutions contre l'acné et cicatrices.", price: "80 - 200 TND" },
  //   { name: "Cryothérapie", description: "Élimination des verrues par le froid.", price: "100 - 250 TND" },
  //   { name: "Traitement laser", description: "Épilation et rajeunissement au laser.", price: "200 - 500 TND" },
  //   { name: "Traitement laser", description: "Épilation et rajeunissement au laser.", price: "200 - 500 TND" }

  // ];
  AllServices: any = [];
  services: any = [];
  messageErr = '';
  p:number = 1 ;
  searchedKeyword!:string;
  selectAll = false;
  selectedServices: any[] = [];
  currentUser: any
  constructor(
    private usersService: DoctorService,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient
  ) { 
   this.currentUser =  this.auth.getcurrentuser();
  }

  ngOnInit(): void {



        this.usersService.getDoctorServices(this.currentUser.id).subscribe(
          (data) => {
            this.services = data;
            console.log(this.services);
            this.usersService.getAllServices().subscribe(
              (data) => {
                this.AllServices = data;
                this.AllServices = this.AllServices.filter((allService: { id: any; }) => {
                  return !this.services.some((doctorService: { id: any }) => doctorService.id === allService.id);
                });
              },
              (err: HttpErrorResponse) => {
                this.messageErr = "We don't found this blog in our database";
              }
            );
          },
          (err: HttpErrorResponse) => {
            this.messageErr = "We don't found this blog in our database";
          }
        );
  }

loaddata(){
  this.usersService.getAllServices().subscribe(
    (data) => {
      this.AllServices = data;
      this.AllServices = this.AllServices.filter((allService: { id: any; }) => {
        return !this.services.some((doctorService: { id: any }) => doctorService.id === allService.id);
      });
    },
    (err: HttpErrorResponse) => {
      this.messageErr = "We don't found this blog in our database";
    }
  );
}
  toggleSelectAll(): void {
    this.AllServices.forEach((service: { selected: any; }) => {
      service.selected = this.selectAll;
    });
    this.updateSelectedServices();
  }

  checkIfAllSelected(): void {
    this.selectAll = this.AllServices.every((service: { selected: any; }) => service.selected);
    this.updateSelectedServices();
  }
  updateSelectedServices(): void {
    this.selectedServices = this.AllServices.filter((service: { selected: any; }) => service.selected);
    
  }

  AddService() {
    // Check if there are any selected services
    if (this.selectedServices.length === 0) {
      Swal.fire("No services selected", "Please select services before saving.", "warning");
      return;
    }
  
    // Show confirmation dialog with the number of selected services
    Swal.fire({
      title: `Do you want to save the changes? (${this.selectedServices.length} services)`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      if (result.isConfirmed) {
        // Extract service IDs from selected services
        const serviceIds = this.selectedServices.map(service => service.id);
  
        // Assuming `this.currentUser.id` is the current doctor's ID
        const doctorId = this.currentUser.id;
  
        // Send request to your backend API
        this.saveDoctorServices(doctorId, serviceIds).then(response => {
          Swal.fire("Saved!", "", "success");
        }).catch(error => {
          Swal.fire("Error", error.error.error, "error");
        });
  
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }
  saveDoctorServices(doctorId: any, serviceIds: any[]) {
    return new Promise((resolve, reject) => {
      // Assuming you're using Angular's HttpClient to send a POST request to save the services
      this.http.post(`http://localhost:3000/api/v1/doctor_add_services/${doctorId}/add_services`, { service_ids: serviceIds })
        .subscribe(response => {
          resolve(response);
          setTimeout(() => {
            window.location.reload()

          }, 500);
        }, error => {
          reject(error);
        });
    });
  }

  deleteService(id: any, i: number) {
    debugger
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
          this.usersService.ArchiveService(id).subscribe(
            response => {
              // If the deletion is successful, remove the user from the list
              this.services.splice(i, 1);
              Swal.fire(
                'Deleted!',
                'This service is no longer disponible.',
                'success'
              );

              setTimeout(() => {
                this.loaddata
              }, 100);
            },
            error => {
              // If there's an error, display the error message
              Swal.fire(
                'Error!',
                'You can\'t archvie this service',
                'error'
              );
            }
          );
        }
      });
    }
}
