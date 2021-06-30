import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { TraitementComponent } from './traitement/traitement.component';
import { TraitementDetailsComponent } from './traitement-details/traitement-details.component';
import { DoctorComponent } from './doctor.component';
import { AddTraitementResolver } from './traitement/add-traitement.resolver';
import { ProfileResolver } from './profile/profile.resolver';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { TraitementsResolver } from './account/traitements.resolver';
import { TraitementDetailsResolver } from './traitement-details/traitement-details.resolver';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';
import { NgxGalleryModule } from 'ngx-gallery';
@NgModule({
  declarations: [
    AccountComponent,
    ProfileComponent,
    DoctorComponent,
    TraitementComponent,
    TraitementDetailsComponent,
    EditPasswordComponent
  ],
  imports: [
    NgxGalleryModule,
    CommonModule,
    DoctorRoutingModule,
    SharedModule,
    SharedMaterialModule
  ],
  providers: [AddTraitementResolver, ProfileResolver, TraitementsResolver, TraitementDetailsResolver],
  entryComponents: [
  ]
})
export class DoctorModule { }
