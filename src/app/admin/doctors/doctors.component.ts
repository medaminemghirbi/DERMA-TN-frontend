import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css'],
  
})
export class DoctorsComponent implements OnInit {
  doctors:any = []
  last_import:any = []
  filteredDoctors:any = []

  isLoading: boolean = false;
  sortOrder: 'asc' | 'desc' = 'asc';
  messageErr: string = '';
  p:number = 1 ;
  searchedKeyword: string = ''; // Initialized as an empty string
  constructor(private usersService: AdminService,     private toastr: ToastrService,
    private http: HttpClient, private route: Router, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      plan: [''],
      id: [''],
      customLimit: [null]
    });
   }
  isCollapsed: boolean[] = [];
  updateForm!: FormGroup;
  iscustomLimit: boolean = false; // To track if the selected plan is 'custom'


  ngOnInit(): void {
    this.loadDoctors(); // Load initial data
    this.isCollapsed = this.filteredDoctors.map(() => true);

    this.usersService.last_run().subscribe(data => {
      this.last_import = data;
      console.log(this.last_import)
    }, error => {
      console.error('Error fetching doctors', error);
    });

  }
    // Toggle the expanded/collapsed state
    toggleDescription(index: number): void {
      this.isCollapsed[index] = !this.isCollapsed[index];
    }
  loadDoctors(): void {
    this.isLoading = true;
    this.usersService.getDoctors().subscribe(data => {
      this.doctors = data;
      this.filteredDoctors = data;
      this.isLoading = false;
    }, error => {
      console.error('Error fetching doctors', error);
      this.isLoading = false;
    });
  }
  sortByName(): void {
    if (this.sortOrder === 'asc') {
      this.filteredDoctors.sort((a: { location: string, firstname:string }, b: { location: any, firstname:string }) => a.location.localeCompare(b.location));
      this.sortOrder = 'desc';
    } else {
      this.filteredDoctors.sort((a: { location: any, firstname:string }, b: { location: string, firstname:string }) => b.location.localeCompare(a.location));
      this.sortOrder = 'asc';
    }
  }
  sortByCreatedAt(): void {
    if (this.sortOrder === 'asc') {
      this.filteredDoctors.sort((a: { created_at: string }, b: { created_at: string }) => 
        new Date(a.created_at.split('.').reverse().join('-')).getTime() - new Date(b.created_at.split('.').reverse().join('-')).getTime()
      );
      this.sortOrder = 'desc';
    } else {
      this.filteredDoctors.sort((a: { created_at: string }, b: { created_at: string }) => 
        new Date(b.created_at.split('.').reverse().join('-')).getTime() - new Date(a.created_at.split('.').reverse().join('-')).getTime()
      );
      this.sortOrder = 'asc';
    }
  }
  
  searchDoctors(): void {
    const trimmedKeyword = this.searchedKeyword ? this.searchedKeyword.trim() : '';
  
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
  
    this.p = 1; // Reset pagination when searching
  }
  
  activateCompte(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Activate it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.activateCompte(id).subscribe(
          response => {
            // Display success message
            Swal.fire('Account Activated Successfully!', '', 'success').then(() => {
              // Find the index of the user and update the corresponding row
              const userIndex = this.filteredDoctors.findIndex((user: { id: any; }) => user.id === id);
              if (userIndex !== -1) {
                this.filteredDoctors[userIndex].email_confirmed = true;
                this.filteredDoctors[userIndex].confirm_token = null;
                // Optionally, update any other UI elements related to this user
              }
            });
          },
          error => {
            // Handle errors if any
            Swal.fire('Error!', 'There was a problem activating the account.', 'error');
          }
        );
      }
    });
  }
  opendataCSV() {

    Swal.fire({
      title: 'Attention !',
      html: `
        <strong>Cettre action va scrapper des informations sur les docteurs et les importer depuis un fichier CSV.</strong><br/>
        <span style="font-size: larger;">Cela pourrait prendre un certain temps. <br> Êtes-vous sûr de vouloir continuer ?</span>
      `,
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Oui, continuer',
      denyButtonText: 'Non, annuler',
      width: '800px',
      padding: '60px',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.usersService.reloadData().subscribe(
          (data) => {
            this.isLoading = false;
            this.doctors = data.doctor; // Supposant que `doctor` est un champ dans `data`
            Swal.fire({
              title: 'Succès !',
              text: 'Les docteurs ont été importés avec succès !',
              icon: 'success',
              confirmButtonText: 'OK',
              width: '400px',
            }).then(() => {
              // Recharger la page après l'importation réussie
              window.location.reload();
            });
          },
          (err: HttpErrorResponse) => {
            this.isLoading = false;
            Swal.fire({
              title: 'Erreur',
              text: 'Une erreur est survenue lors de l\'importation des données.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        );
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Annulé',
          text: 'Aucune modification n\'a été sauvegardée.',
          icon: 'info',
          confirmButtonText: 'OK',
        });
      }
    });
    

  }
  refreshDoctors(): void {
    this.loadDoctors();
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
        this.usersService.ArchiveDoctor(id).subscribe(
          response => {
            // If the deletion is successful, remove the user from the list
            this.doctors.splice(i, 1);
            Swal.fire(
              'Deleted!',
              'Contract type has been Archived.',
              'success'
            );
          },
          error => {
            // If there's an error, display the error message
            Swal.fire(
              'Error!',
              'You can\'t archvie user with active contract',
              'error'
            );
          }
        );
      }
    });
  }
   // Method to bind doctor data to the modal
   bind_data(doctor: any) {
    this.updateForm.patchValue({
      id: doctor.id,
      firstname: doctor.firstname,
      lastname: doctor.lastname,
      plan: doctor.plan,
      customLimit: doctor.custom_limit || null
    });

    // Check if the plan is 'custom' to show the custom input field
    this.iscustomLimit = doctor.plan === 'custom';
  }

  // Method to handle plan change
  onPlanChange(event: any) {
    const selectedPlan = event.target.value;
    this.iscustomLimit = selectedPlan === 'custom';
    
    // Reset custom plan if not custom
    if (!this.iscustomLimit) {
      this.updateForm.patchValue({ customLimit: null });
    }
  }

  // Method to handle form submission
  async update_plan() {
    const formData = this.updateForm.value;
    // Logic to update the doctor's plan based on formData
    console.log('Updated plan data:', formData);
    
    try {
      debugger
      await this.http.patch(environment.urlBackend + `api/v1/doctors/${formData.id}/upgrade_plan`, formData).toPromise();
      
      window.location.reload()
      // Option 2: Refresh the relevant part of the view
      // For example, if you are using Angular, you might call a method to refresh the data:
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }
  
}
