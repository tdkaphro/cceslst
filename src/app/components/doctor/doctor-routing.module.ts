import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { doctorRoutes } from 'src/app/routes/doctor-route';

@NgModule({
  imports: [RouterModule.forChild(doctorRoutes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
