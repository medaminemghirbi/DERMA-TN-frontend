import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-doctor-sidebar',
  templateUrl: './doctor-sidebar.component.html',
  styleUrls: ['./doctor-sidebar.component.css']
})
export class DoctorSidebarComponent implements OnInit {
  currentuser :any
  userType :any
  constructor(private auth: AuthService,private router: Router,    private toastr: ToastrService) {
    this.currentuser = this.auth.getcurrentuser();
    this.userType = sessionStorage.getItem('user_type') || 'Guest';
  }

  ngOnInit(): void {
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }


  verifier_plan() {
    if (this.currentuser.plan !== 'no_plan') {
      // Navigate to the analyze image page
      this.router.navigate(['/doctor/analyze-image']);
    } else {
      // Show an error message
      this.toastr.error('You Can\'t Access It!', 'Fonctionality not Allowed Please Contact DocPro!');
    }
  }
  alert(){
    this.toastr.info('coming soon', 'Fonctionality will be added stay tuned!');

  }
}
