import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountComponent } from './account/account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TraitementsComponent } from './traitements/traitements.component';
import { TraitementDetailsComponent } from './traitement-details/traitement-details.component';
import { MessagesComponent } from './messages/messages.component';
import { PraticiensComponent } from './praticiens/praticiens.component';
import { PraticienComponent } from './praticien/praticien.component';
import { PraticiensResolver } from './praticiens/praticiens.resolver';
import { TraitementsAdminResolver } from './traitements/traitements-admin.resolver';
import { PraticienAdminResolver } from './praticien/praticien-admin.resolver';
import { MessageAnonymesResolver } from './messages/message-anonyme.resolver';
import { MessagePopupComponent } from './message-popup/message-popup.component';
import { TraitementDetailsAdminResolver } from './traitement-details/traitement-details.resolver';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { ListAdminComponent } from './list-admin/list-admin.component';
import { AdminsListResolver } from './list-admin/admins.resolver';
import { FilteredTraitementsComponent } from './filtered-traitements/filtered-traitements.component';
import { FilteredTraitementsResolver } from './filtered-traitements/filtered-traitements.resolver';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';
import { AdminContainerResolver } from './container/container.resolver';
import { BlockedUsersComponent } from './blocked-users/blocked-users.component';
import { DashboardResolver } from './dashboard/dashboard.resolver';
import { NgxGalleryModule } from 'ngx-gallery';

@NgModule({
  declarations: [
    AccountComponent,
    ResetPasswordComponent,
    ContainerComponent,
    DashboardComponent,
    TraitementsComponent,
    TraitementDetailsComponent,
    MessagesComponent,
    PraticiensComponent,
    PraticienComponent,
    MessagePopupComponent,
    AddAdminComponent,
    ListAdminComponent,
    FilteredTraitementsComponent,
    BlockedUsersComponent
  ],
  imports: [
    NgxGalleryModule,
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    SharedMaterialModule
  ],
  providers: [
    PraticiensResolver,
    TraitementsAdminResolver,
    PraticienAdminResolver,
    MessageAnonymesResolver,
    TraitementDetailsAdminResolver,
    AdminsListResolver,
    FilteredTraitementsResolver,
    AdminContainerResolver,
    DashboardResolver
  ],
  entryComponents: [
    MessagePopupComponent
  ]
})
export class AdminModule { }
