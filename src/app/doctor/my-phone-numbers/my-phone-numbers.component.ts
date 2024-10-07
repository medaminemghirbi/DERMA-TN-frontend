import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-phone-numbers',
  templateUrl: './my-phone-numbers.component.html',
  styleUrls: ['./my-phone-numbers.component.css']
})
export class MyPhoneNumbersComponent implements OnInit {
  my_phones: any[] = [];
  currentUser: any;
  newPhoneNumbers: { number: string; phone_type: string }[] = [];
  editingPhoneIndex: number = -1; // Use -1 to indicate no phone is being edited
  messageErr = "";

  constructor(private doctorService: DoctorService, private auth: AuthService) { 
    this.currentUser = this.auth.getcurrentuser();
  }

  ngOnInit(): void {
    this.doctorService.getMyPhoneNumbers(this.currentUser.id).subscribe(
      (data) => {
        this.my_phones = data;
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We didn't find any phone numbers in our database.";
      }
    );
  }

  // Add a new phone number field dynamically
  addNewPhoneNumberField() {
    this.newPhoneNumbers.push({ number: '', phone_type: '' });
  }

  // Create phone numbers for the current doctor
  createPhoneNumbers() {
    this.newPhoneNumbers.forEach(phoneNumber => {
      this.doctorService.createPhoneNumber(this.currentUser.id, phoneNumber).subscribe(
        (data) => {
          this.my_phones.push(data); // Add the newly created phone number to the list
          this.messageErr = ""; // Clear any error messages
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.messageErr = "Failed to create phone number.";
        }
      );
    });
    this.newPhoneNumbers = []; // Reset the array after creation
  }

  // Start editing a phone number
  editPhone(index: number) {
    const phoneToEdit = this.my_phones[index];
    this.editingPhoneIndex = index; // Track the index of the phone being edited
    this.newPhoneNumbers = [{ ...phoneToEdit }]; // Prefill the form with the phone's details
  }

  // Update the phone number being edited
  updatePhoneNumber() {
    if (this.editingPhoneIndex >= 0) { // Check if editingPhoneIndex is valid
      const phoneId = this.my_phones[this.editingPhoneIndex].id;
      const updatedPhoneNumber = this.newPhoneNumbers[0]; // Get the updated phone number from the form
  
      // Show confirmation modal
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to update this phone number?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceed with the update
          this.doctorService.updatePhoneNumber(phoneId, updatedPhoneNumber).subscribe(
            (data) => {
              this.my_phones[this.editingPhoneIndex] = { ...data }; // Update the specific phone number
              this.messageErr = "";
  
              // Show success message
              Swal.fire(
                'Updated!',
                'The phone number has been updated successfully.',
                'success'
              );
  
              this.editingPhoneIndex = -1; // Reset the editing state
              this.newPhoneNumbers = []; // Clear the form
            },
            (err: HttpErrorResponse) => {
              console.log(err);
              this.messageErr = "Failed to update phone number.";
            }
          );
        }
      });
    } else {
      this.messageErr = "No phone number selected for editing."; // Optional: Set an error message if no phone is being edited
    }
  }
  

  // Delete a phone number from the list
  deletePhone(index: number) {
    const phoneId = this.my_phones[index].id;
  
    // Show confirmation modal
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Archive te this phone number?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Archive it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the deletion
        this.doctorService.ArchivePhone(phoneId).subscribe(
          (data: any) => {
            this.my_phones.splice(index, 1); // Remove the phone from the list
            this.messageErr = ""; // Clear any error messages
  
            // Show success message
            Swal.fire(
              'Archived!',
              'The phone number has been Archived successfully.',
              'success'
            );
          },
          (err: HttpErrorResponse) => {
            console.log(err);
            this.messageErr = "Failed to Archived the phone number.";
          }
        );
      }
    });
  }

  normalizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\s+/g, ' ').trim();
}
}
