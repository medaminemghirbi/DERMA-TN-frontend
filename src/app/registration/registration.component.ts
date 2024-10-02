import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  locations: any = [];
  messageErr = ""
  constructor(  private usersService: AdminService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.locations = await this.usersService.getAllLocations().toPromise();
      this.locations.sort((a: any, b: any) => a.name.localeCompare(b.name));

      console.log(this.locations);
    } catch (error) {
      this.messageErr = "We couldn't find any locations in our database.";
    }
  }

}
