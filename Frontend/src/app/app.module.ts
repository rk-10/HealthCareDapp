import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { DocLoginComponent } from './doctor/doc-login/doc-login.component';
import { PatLoginComponent } from './patient/pat-login/pat-login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DoctorComponent,
    PatientComponent,
    DocLoginComponent,
    PatLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
    // HttpClient,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }