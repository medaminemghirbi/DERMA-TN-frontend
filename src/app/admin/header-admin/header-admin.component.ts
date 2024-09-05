import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css']
})
export class HeaderAdminComponent implements OnInit {

  currentuser :any
  userType :any
  constructor(  private Auth: AuthService) {
    this.currentuser = this.Auth.getcurrentuser();
    this.userType = sessionStorage.getItem('user_type') || 'Guest';
  }

  ngOnInit(): void {
  }

}
