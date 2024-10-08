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
import { LandingComponent } from './landing/landing.component';
import { RegistrationComponent } from './registration/registration.component';
import { DoctorSettingsComponent } from './doctor/doctor-settings/doctor-settings.component';
import { PlanningDoctorComponent } from './doctor/planning-doctor/planning-doctor.component';
import { AppointmentRequestsComponent } from './doctor/appointment-requests/appointment-requests.component';
import { MyLocationComponent } from './doctor/my-location/my-location.component';
import { SocialMediaComponent } from './doctor/social-media/social-media.component';
import { NotificationSettingsComponent } from './doctor/notification-settings/notification-settings.component';
import { MyPhoneNumbersComponent } from './doctor/my-phone-numbers/my-phone-numbers.component';
import { DokumentsComponent } from './doctor/dokuments/dokuments.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: IndexComponent },
  { path: 'inscription', component: RegistrationComponent },

  // Admin routes with guards
  { path: 'admin/dashboard', canActivate: [AdminGuard], component: DashboardAdminComponent },
  { path: 'admin/doctors', canActivate: [AdminGuard], component: DoctorsComponent },
  { path: 'admin/patients', canActivate: [AdminGuard], component: PatientsComponent },
  { path: 'admin/planning', canActivate: [AdminGuard], component: PlanningComponent },
  { path: 'admin/blogs', canActivate: [AdminGuard], component: BlogsComponent },
  { path: 'admin/maladies', canActivate: [AdminGuard], component: MaladieComponent },

  // Doctor routes with guards
  { path: 'doctor/dashboard', canActivate: [DoctorGuard], component: DashboardDoctorComponent },
  { path: 'doctor/analyze-image', canActivate: [DoctorGuard], component: AnalyzeImageComponent },
  { path: 'doctor/blogs', canActivate: [DoctorGuard], component: DoctorBlogsComponent },
  { path: 'doctor/planning', canActivate: [DoctorGuard], component: PlanningDoctorComponent },
  { path: 'doctor/appointment-request', canActivate: [DoctorGuard], component: AppointmentRequestsComponent },
  { path: 'doctor/dokuments', canActivate: [DoctorGuard], component: DokumentsComponent },

  { path: 'doctor/settings', canActivate: [DoctorGuard], component: DoctorSettingsComponent },
  { path: 'doctor/settings/my-location', canActivate: [DoctorGuard], component: MyLocationComponent },
  { path: 'doctor/settings/social-media', canActivate: [DoctorGuard], component: SocialMediaComponent },
  { path: 'doctor/settings/notifications', canActivate: [DoctorGuard], component: NotificationSettingsComponent },
  { path: 'doctor/settings/my-phone-numbers', canActivate: [DoctorGuard], component: MyPhoneNumbersComponent },


  // Shared components
  { path: 'forums', component: ForumsComponent },
  { path: 'blog/:id', component: BlogDetailsComponent },

  // Wildcard route
  { path: '**', component: UnauthorizedComponent } // or PageNotFoundComponent for 404 scenarios
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
