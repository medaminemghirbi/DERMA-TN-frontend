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
import { ForumsComponent } from './admin/forums/forums.component';
import { BlogDetailsComponent } from './user/blog-details/blog-details.component';
import { BlogsComponent } from './admin/blogs/blogs.component';
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
    BlogsComponent
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
    NgProgressHttpModule,
    ReactiveFormsModule

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
