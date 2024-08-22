import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { IndexComponent } from './index/index.component';
import { DoctorsComponent } from './admin/doctors/doctors.component';

const routes: Routes = [
  {path:'',component:IndexComponent},
  {path:'admin/dashboard',component:DashboardAdminComponent},
  {path:'admin/doctors',component:DoctorsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
