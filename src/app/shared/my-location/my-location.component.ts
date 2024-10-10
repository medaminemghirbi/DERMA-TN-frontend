import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-location',
  templateUrl: './my-location.component.html',
  styleUrls: ['./my-location.component.css']
})
export class MyLocationComponent implements OnInit {
  role :any
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
   this.role =  this.auth.getRole();
  }

}
