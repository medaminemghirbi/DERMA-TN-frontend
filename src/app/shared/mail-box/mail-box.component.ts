import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mail-box',
  templateUrl: './mail-box.component.html',
  styleUrls: ['./mail-box.component.css']
})
export class MailBoxComponent implements OnInit {
  safeEmailBodies: SafeHtml[] = [];
  role: any;
  messageErr = "";
  currentUser: any;
  emails: any;
  p: number = 1;
  itemsPerPage = 5;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private Auth: AuthService,
    private doctorService: DoctorService,
    private usersService: AdminService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.role = this.Auth.getRole();
    this.currentUser = this.Auth.getcurrentuser();
    this.loadData();

  }
  isButtonDisabled(sentAt: string): boolean {
    const emailDate = new Date(sentAt);
    const now = new Date();
    const oneHourLater = new Date(emailDate.getTime() + 60 * 60 * 1000);
    return now > oneHourLater;
  }
  loadData(){
    this.doctorService.getAllEmail(this.role,this.currentUser.id).subscribe(
      (data) => {
        this.emails = data;
        console.log(this.emails);

        // Sanitize each email body
        this.safeEmailBodies = this.emails.map((email: any) => 
          this.sanitizer.bypassSecurityTrustHtml(email.body)
        );
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        this.messageErr = "We didn't find any phone numbers in our database.";
      }
    );
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
        this.doctorService.deleteEmail(id).subscribe(
          response => {
            // If the deletion is successful, remove the user from the list
            this.emails.splice(i, 1);
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
  refrechMail(){
    this.loadData();
  }
}
