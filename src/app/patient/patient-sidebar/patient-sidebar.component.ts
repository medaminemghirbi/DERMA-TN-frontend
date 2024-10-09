import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-patient-sidebar',
  templateUrl: './patient-sidebar.component.html',
  styleUrls: ['./patient-sidebar.component.css']
})
export class PatientSidebarComponent implements OnInit {
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

}
