import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { publicRoutes } from 'src/app/routes/public-route';

@NgModule({
  imports: [RouterModule.forChild(publicRoutes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
