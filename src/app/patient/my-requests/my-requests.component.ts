import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  myRequests: any = [];
  filteredRequests: any = [];
  currentUser : any;
  messageErr = "";
  searchedKeyword = "";
  selectedStatus = ""; // To store the selected status filter
  p: number = 1;
  isLoading: boolean = false;
  constructor(private usersService: AdminService, private auth: AuthService) {
    this.currentUser = this.auth.getcurrentuser();
  }

  async refreshRequests(): Promise<void> {
    try {
      // Fetch the requests
      this.isLoading =true
      this.myRequests = await this.usersService.getMyReuqests(this.currentUser.id).toPromise();
      this.isLoading =false
    } catch (error) {
      this.messageErr = "We couldn't find any doctors in our database.";
    }
  }
  async ngOnInit(): Promise<void> {
    try {
      // Fetch the requests
      this.myRequests = await this.usersService.getMyReuqests(this.currentUser.id).toPromise();
      this.filterRequests(); // Apply filtering after data is fetched
      console.log(this.myRequests)
    } catch (error) {
      this.messageErr = "We couldn't find any doctors in our database.";
    }
  }

  // Filter requests based on the search keyword and status
  filterRequests() {
    // Apply both search and status filters
    this.filteredRequests = this.myRequests.filter((item: any) => {
      const matchesKeyword = item.doctor.firstname.toLowerCase().includes(this.searchedKeyword.toLowerCase()) ||
                             item.doctor.lastname.toLowerCase().includes(this.searchedKeyword.toLowerCase()) ||
                             item.patient.firstname.toLowerCase().includes(this.searchedKeyword.toLowerCase()) ||
                             item.patient.lastname.toLowerCase().includes(this.searchedKeyword.toLowerCase());

      const matchesStatus = this.selectedStatus ? item.status === this.selectedStatus : true;

      return matchesKeyword && matchesStatus;
    });
  }
  searchAppointment(): void {
    const trimmedKeyword = this.searchedKeyword ? this.searchedKeyword.trim() : '';
  
    if (trimmedKeyword) {
      this.filteredRequests = this.myRequests.filter((doctor: { firstname: string, lastname:string  }) =>
        doctor.firstname.toLowerCase().includes(trimmedKeyword.toLowerCase()) ||
        doctor.lastname.toLowerCase().includes(trimmedKeyword.toLowerCase())

      );
    } else {
      this.filteredRequests = [...this.myRequests];
    }
  
    this.p = 1;
  }
}
