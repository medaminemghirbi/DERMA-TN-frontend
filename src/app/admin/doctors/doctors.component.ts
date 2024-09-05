import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
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
  constructor(private usersService: AdminService, private route: Router) { }
  isCollapsed: boolean[] = [];

  ngOnInit(): void {
    this.loadDoctors(); // Load initial data
    this.isCollapsed = this.filteredDoctors.map(() => true);

    this.usersService.last_run().subscribe(data => {
      debugger
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
      this.filteredDoctors = this.doctors.filter((doctor: { firstname: string, location:string, lastname:string  }) =>
        doctor.firstname.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        doctor.location.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        doctor.lastname.toLowerCase().includes(trimmedKeyword.toLowerCase())

      );
    } else {
      this.filteredDoctors = [...this.doctors];
    }
  
    this.p = 1;
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
}
