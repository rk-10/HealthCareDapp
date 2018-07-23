import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent }  from './home/home.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'doctor', redirectTo: '/doctor/login', pathMatch: 'full'},
  { path: 'doctor/login', component: DoctorComponent},
  { path: 'patient', redirectTo: '/patient/login', pathMatch: 'full'},
  { path: 'patient/login', component: PatientComponent}
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)]
})

export class AppRoutingModule { }
