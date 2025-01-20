import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-doctor-profil',
  templateUrl: './doctor-profil.component.html',
  styleUrls: ['./doctor-profil.component.css']
})
export class DoctorProfilComponent implements OnInit {
  role:any
  doctorDetail: any
  messageErr = ""
  constructor(
    private usersService: AdminService,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute, 
    private http: HttpClient,
    private Auth :AuthService  ) { }

  ngOnInit(): void {
    this.role = this.Auth.getRole();


        const doctorId = this.activatedRoute.snapshot.params['id'];
        this.usersService.getDoctor(doctorId).subscribe(
          (data) => {
            this.doctorDetail = data;
            console.log(this.doctorDetail);
          },
          (err: HttpErrorResponse) => {
            console.log(err);
            this.messageErr = "We don't found this blog in our database";
          }
        );
  }

}
