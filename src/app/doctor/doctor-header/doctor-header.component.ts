import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-doctor-header',
  templateUrl: './doctor-header.component.html',
  styleUrls: ['./doctor-header.component.css']
})
export class DoctorHeaderComponent implements OnInit {
  currentuser : any
  constructor(private auth : AuthService) { }

  ngOnInit(): void {
    this.currentuser = this.auth.getcurrentuser();
  }

}
