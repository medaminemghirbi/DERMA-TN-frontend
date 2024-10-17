import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  nearstdoctor: any = [];
  doctors: any = [];
  currentUser : any
  messageErr=""
  searchedKeyword =""
  p:number = 1 ;
  selectedLocation: string = "";
  selectedDoctorId: string = '';
  selectedDoctorName!: string;
  message =""
  constructor(private usersService: AdminService, private auth: AuthService) {
    this.currentUser = this.auth.getcurrentuser();
   }

  async ngOnInit(): Promise<void> {
    try {
      this.nearstdoctor = await this.usersService.getNearstDoctor(this.currentUser.location, this.currentUser.radius).toPromise();
      this.nearstdoctor.sort((a: any, b: any) => a.firstname.localeCompare(b.firstname));
      console.log(this.nearstdoctor)
    } catch (error) {
      this.messageErr = "We couldn't find any nerst doctors in our database.";
    }
  }
}
