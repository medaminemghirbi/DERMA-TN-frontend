import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { IndexComponent } from './index/index.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderAdminComponent } from './admin/header-admin/header-admin.component';
import { SidebarAdminComponent } from './admin/sidebar-admin/sidebar-admin.component';
import { DoctorsComponent } from './admin/doctors/doctors.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { PatientsComponent } from './admin/patients/patients.component';
import { PlanningComponent } from './admin/planning/planning.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ForumsComponent } from './shared/spinner/forums/forums.component';
import { BlogDetailsComponent } from './user/blog-details/blog-details.component';
import { BlogsComponent } from './admin/blogs/blogs.component';
import { DashboardDoctorComponent } from './doctor/dashboard-doctor/dashboard-doctor.component';
import { PlanningDoctorComponent } from './doctor/planning-doctor/planning-doctor.component';
import { DoctorHeaderComponent } from './doctor/doctor-header/doctor-header.component';
import { DoctorSidebarComponent } from './doctor/doctor-sidebar/doctor-sidebar.component';
import { ToastrModule } from 'ngx-toastr';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AnalyzeImageComponent } from './doctor/analyze-image/analyze-image.component';
import { MaladieComponent } from './admin/maladie/maladie.component';
import { DoctorBlogsComponent } from './doctor/doctor-blogs/doctor-blogs.component';
import { LandingComponent } from './landing/landing.component';
import { RegistrationComponent } from './registration/registration.component';
import { DoctorSettingsComponent } from './doctor/doctor-settings/doctor-settings.component';
import { FirstKeyValuePipe } from './first-key-value.pipe';
import { AppointmentRequestsComponent } from './doctor/appointment-requests/appointment-requests.component';
import { FilterByStatusPipe } from './filter-by-status.pipe';
import { MapPickerComponent } from './map-picker/map-picker.component';
import { MyLocationComponent } from './doctor/my-location/my-location.component';
import { HeaderSettingsComponent } from './doctor/header-settings/header-settings.component';
import { SocialMediaComponent } from './doctor/social-media/social-media.component';
import { NotificationSettingsComponent } from './doctor/notification-settings/notification-settings.component';
import { NotifiacationAlertComponent } from './shared/notifiacation-alert/notifiacation-alert.component';
import { MyPhoneNumbersComponent } from './doctor/my-phone-numbers/my-phone-numbers.component';
import { DokumentsComponent } from './doctor/dokuments/dokuments.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardAdminComponent,
    IndexComponent,
    HeaderAdminComponent,
    SidebarAdminComponent,
    DoctorsComponent,
    SpinnerComponent,
    PatientsComponent,
    PlanningComponent,
    ForumsComponent,
    BlogDetailsComponent,
    BlogsComponent,
    DashboardDoctorComponent,
    PlanningDoctorComponent,
    DoctorHeaderComponent,
    DoctorSidebarComponent,
    UnauthorizedComponent,
    AnalyzeImageComponent,
    MaladieComponent,
    DoctorBlogsComponent,
    LandingComponent,
    RegistrationComponent,
    DoctorSettingsComponent,
    FirstKeyValuePipe,
    AppointmentRequestsComponent,
    FilterByStatusPipe,
    MapPickerComponent,
    MyLocationComponent,
    HeaderSettingsComponent,
    SocialMediaComponent,
    NotificationSettingsComponent,
    NotifiacationAlertComponent,
    MyPhoneNumbersComponent,
    DokumentsComponent,

    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgProgressModule,
    FullCalendarModule,
    NgProgressModule.withConfig({
      color: "#003d99"
    }),
    ToastrModule.forRoot({ // ToastrModule added
      timeOut: 1500,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
    }),
    NgProgressHttpModule,
    ReactiveFormsModule,
    FullCalendarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
