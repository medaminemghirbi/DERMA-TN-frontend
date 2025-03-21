import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  messageErr= ""
  public userType: string = '';
  statistique:any = []; 
  admindata:any;

  appointement_count: any
  patient_count: any
  BLogs_count: any
  doctors_count: any
  scanned_count: any
  maladies_count: any

  chartType: any;
  chartOptions: any
  chartDatasets: any = [];
  chartLabels: any = [];
  chartColors: any = [];
  chartReady = false;

  
  constructor( private route: Router , private auth: AuthService,private usersService: AdminService ) { 
    this.chartType = 'bar';
    this.chartLabels = ['Consultation', 'Patient', 'Blogs', 'Doctors', 'Number of diseases trained by AI', 'Scanned Image With IA'];
    this.chartColors = [
      {
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(135, 107, 28, 0.2)',
          'rgba(28, 13, 236, 0.2)',

          'rgba(243, 215, 55, 0.2)',


        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(135, 107, 28, 1)',
          'rgba(28, 13, 236, 0.2)',
          'rgba(243, 215, 55, 0.2)',



        ],
        borderWidth: 2,
      }
    ];
    this.chartOptions = {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            precision: 0
          }
        }]
      },
      barPercentage: 0.6,
      categoryPercentage: 0.8
    };

  }

  ngOnInit(): void {
    this.admindata = JSON.parse(sessionStorage.getItem('admindata')!);
    this.userType = sessionStorage.getItem('user_type') || 'Guest';
  
    this.usersService.statistique().subscribe(
      (data) => {
        // Extract values from the API response correctly
        this.chartDatasets = [
          { 
            data: [
              data.apointements, 
              data.patients, 
              data.blogs, 
              data.doctors, 
              data.maladies,
              data.scanned

            ], 
            label: 'DermaPro Officiel statistic' 
          }
        ];
        this.chartReady = true;
      }, 
      (err: HttpErrorResponse) => {
        this.messageErr = "We didn't find any data in our database.";
      }
    );
  }
  
  chartClicked(event: any): void {
  }

  chartHovered(event: any): void {
  }
}
