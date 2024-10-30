import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-patient-header',
  templateUrl: './patient-header.component.html',
  styleUrls: ['./patient-header.component.css']
})
export class PatientHeaderComponent implements OnInit {
  currentuser : any
  constructor(private auth : AuthService) { }

  ngOnInit(): void {
    this.currentuser = this.auth.getcurrentuser();
  }

}
