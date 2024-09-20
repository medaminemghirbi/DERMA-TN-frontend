import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-doctor-sidebar',
  templateUrl: './doctor-sidebar.component.html',
  styleUrls: ['./doctor-sidebar.component.css']
})
export class DoctorSidebarComponent implements OnInit {

  constructor(private route: Router , private auth: AuthService) { }

  ngOnInit(): void {
  }

  logout(){
    this.auth.logout();
    this.route.navigate(['']);
  }

}
