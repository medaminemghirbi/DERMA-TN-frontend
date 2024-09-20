import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { IndexComponent } from './index/index.component';
import { DoctorsComponent } from './admin/doctors/doctors.component';
import { PatientsComponent } from './admin/patients/patients.component';
import { PlanningComponent } from './admin/planning/planning.component';
import { ForumsComponent } from './shared/spinner/forums/forums.component';
import { BlogDetailsComponent } from './user/blog-details/blog-details.component';
import { BlogsComponent } from './admin/blogs/blogs.component';
import { GuardGuard } from './services/guard.guard';
import { DashboardDoctorComponent } from './doctor/dashboard-doctor/dashboard-doctor.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { DoctorGuard } from './guards/doctor.guard';
import { AdminGuard } from './guards/admin.guard';
import { AnalyzeImageComponent } from './doctor/analyze-image/analyze-image.component';
import { MaladieComponent } from './admin/maladie/maladie.component';
import { DoctorBlogsComponent } from './doctor/doctor-blogs/doctor-blogs.component';

const routes: Routes = [
  ///////////////****** Page Index *****///////////////////////
  {path:'',component:IndexComponent},

  ///////////////****** Admin Components *****///////////////////////

  {path:'admin/dashboard',canActivate:[AdminGuard],component:DashboardAdminComponent},
  {path:'admin/doctors',canActivate:[AdminGuard],component:DoctorsComponent},
  {path:'admin/patients',canActivate:[AdminGuard],component:PatientsComponent},
  {path:'admin/planning',canActivate:[AdminGuard],component:PlanningComponent},
  {path:'forums',component:ForumsComponent},
  {path:'admin/blogs',canActivate:[AdminGuard],component:BlogsComponent},
  {path:'admin/diseas',canActivate:[AdminGuard],component:MaladieComponent},
    ///////////////****** Doctor Components *****///////////////////////
  {path:'doctor/dashboard',canActivate:[DoctorGuard],component:DashboardDoctorComponent},
  {path:'doctor/analyze-image',canActivate:[DoctorGuard],component:AnalyzeImageComponent},
  {path:'doctor/blogs',canActivate:[DoctorGuard],component:DoctorBlogsComponent},


  /////////////////// *SHARED COMPONENT *//////////////////////////////////
  {path:'blog/:id',component:BlogDetailsComponent},

  // Wildcard route
  { path: '**',  component: UnauthorizedComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
