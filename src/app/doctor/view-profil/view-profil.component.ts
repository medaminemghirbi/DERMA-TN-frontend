import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-view-profil',
  templateUrl: './view-profil.component.html',
  styleUrls: ['./view-profil.component.css']
})
export class ViewProfilComponent implements OnInit {
  currentUser : any
  constructor(private auth: AuthService) {
    this.currentUser = this.auth.getcurrentuser();
   }

  ngOnInit(): void {
  }

}
