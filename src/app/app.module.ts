import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { IndexComponent } from './index/index.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
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
import { MapPickerComponent } from './doctor/map-picker/map-picker.component';
import { MyLocationComponent } from './shared/my-location/my-location.component';
import { HeaderSettingsComponent } from './doctor/header-settings/header-settings.component';
import { SocialMediaComponent } from './doctor/social-media/social-media.component';
import { NotificationSettingsComponent } from './doctor/notification-settings/notification-settings.component';
import { NotifiacationAlertComponent } from './shared/notifiacation-alert/notifiacation-alert.component';
import { MyPhoneNumbersComponent } from './doctor/my-phone-numbers/my-phone-numbers.component';
import { DokumentsComponent } from './doctor/dokuments/dokuments.component';
import { DashboardPatientComponent } from './patient/dashboard-patient/dashboard-patient.component';
import { PatientSidebarComponent } from './patient/patient-sidebar/patient-sidebar.component';
import { PatientHeaderComponent } from './patient/patient-header/patient-header.component';
import { BlogsPatientComponent } from './patient/blogs-patient/blogs-patient.component';
import { MyRequestsComponent } from './patient/my-requests/my-requests.component';
import { SettingsPatientComponent } from './patient/settings-patient/settings-patient.component';
import { HeaderPatientSettingsComponent } from './patient/header-patient-settings/header-patient-settings.component';
import { MapPickerPatientComponent } from './patient/map-picker-patient/map-picker-patient.component';
import { AddNewRequestComponent } from './patient/add-new-request/add-new-request.component';
import { SelectDateComponent } from './patient/select-date/select-date.component';
import { Spinner2Component } from './shared/spinner2/spinner2.component';
import { BookNowComponent } from './patient/book-now/book-now.component';
import { MailBoxComponent } from './shared/mail-box/mail-box.component';
import { MeetingOnlineComponent } from './shared/meeting-online/meeting-online.component';
import { EmailNotificationComponent } from './shared/email-notification/email-notification.component';
import { NotificationSettingComponent } from './patient/notification-setting/notification-setting.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ChangeImageComponent } from './patient/change-image/change-image.component';
import { NotificationsComponent } from './shared/notifications/notifications.component';
import { ReportsComponent } from './doctor/analyze-image/reports/reports.component';
import { NgxLoadersCssModule } from 'ngx-loaders-css';
import { DoctorProfilComponent } from './shared/doctor-profil/doctor-profil.component';
import { NgxEditorModule } from 'ngx-editor';
import { ParcoursAcademiqueComponent } from './doctor/parcours-academique/parcours-academique.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
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
    DashboardPatientComponent,
    PatientSidebarComponent,
    PatientHeaderComponent,
    BlogsPatientComponent,
    MyRequestsComponent,
    SettingsPatientComponent,
    HeaderPatientSettingsComponent,
    MapPickerPatientComponent,
    AddNewRequestComponent,
    SelectDateComponent,
    Spinner2Component,
    BookNowComponent,
    MailBoxComponent,
    MeetingOnlineComponent,
    EmailNotificationComponent,
    NotificationSettingComponent,
    ChangeImageComponent,
    NotificationsComponent,
    ReportsComponent,
    DoctorProfilComponent,
    ParcoursAcademiqueComponent,

    
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
    NgxLoadersCssModule,
    NgxEditorModule,
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
    FullCalendarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
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
