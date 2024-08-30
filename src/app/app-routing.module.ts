import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { IndexComponent } from './index/index.component';
import { DoctorsComponent } from './admin/doctors/doctors.component';
import { PatientsComponent } from './admin/patients/patients.component';
import { PlanningComponent } from './admin/planning/planning.component';
import { ForumsComponent } from './admin/forums/forums.component';
import { BlogDetailsComponent } from './user/blog-details/blog-details.component';
import { BlogsComponent } from './admin/blogs/blogs.component';

const routes: Routes = [
  {path:'',component:IndexComponent},
  {path:'admin/dashboard',component:DashboardAdminComponent},
  {path:'admin/doctors',component:DoctorsComponent},
  {path:'admin/patients',component:PatientsComponent},
  {path:'admin/planning',component:PlanningComponent},
  {path:'admin/forums',component:ForumsComponent},
  {path:'admin/blogs',component:BlogsComponent},




  {path:'blog/:id',component:BlogDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
