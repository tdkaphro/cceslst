import { Routes } from '@angular/router';
import { ContainerComponent } from '../components/admin/container/container.component';
import { DashboardComponent } from '../components/admin/dashboard/dashboard.component';
import { TraitementsComponent } from '../components/admin/traitements/traitements.component';
import { TraitementDetailsComponent } from '../components/admin/traitement-details/traitement-details.component';
import { MessagesComponent } from '../components/admin/messages/messages.component';
import { AccountComponent } from '../components/admin/account/account.component';
import { PraticienComponent } from '../components/admin/praticien/praticien.component';
import { PraticiensComponent } from '../components/admin/praticiens/praticiens.component';
import { PraticiensResolver } from '../components/admin/praticiens/praticiens.resolver';
import { TraitementsAdminResolver } from '../components/admin/traitements/traitements-admin.resolver';
import { PraticienAdminResolver } from '../components/admin/praticien/praticien-admin.resolver';
import { MessageAnonymesResolver } from '../components/admin/messages/message-anonyme.resolver';
import { TraitementDetailsAdminResolver } from '../components/admin/traitement-details/traitement-details.resolver';
import { AddAdminComponent } from '../components/admin/add-admin/add-admin.component';
import { ListAdminComponent } from '../components/admin/list-admin/list-admin.component';
import { AdminsListResolver } from '../components/admin/list-admin/admins.resolver';
import { FilteredTraitementsComponent } from '../components/admin/filtered-traitements/filtered-traitements.component';
import { FilteredTraitementsResolver } from '../components/admin/filtered-traitements/filtered-traitements.resolver';
import { AdminContainerResolver } from '../components/admin/container/container.resolver';
import { BlockedUsersComponent } from '../components/admin/blocked-users/blocked-users.component';
import { DashboardResolver } from '../components/admin/dashboard/dashboard.resolver';

export const adminRoutes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    {
        path: 'main',
        component: ContainerComponent,
        resolve: { value: AdminContainerResolver },
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                resolve: { value: DashboardResolver }
            },
            {
                path: 'traitements',
                component: TraitementsComponent,
                resolve: { value: TraitementsAdminResolver }
            },
            {
                path: 'filtered-traitements/:filter',
                component: FilteredTraitementsComponent,
                resolve: { value: FilteredTraitementsResolver }
            },
            {
                path: 'traitement/:id',
                component: TraitementDetailsComponent,
                resolve: { value: TraitementDetailsAdminResolver }
            },
            {
                path: 'praticiens',
                component: PraticiensComponent,
                resolve: { value: PraticiensResolver }
            },
            {
                path: 'blocked-users',
                component: BlockedUsersComponent,
                resolve: { value: PraticiensResolver }
            },
            {
                path: 'praticien/:login',
                component: PraticienComponent,
                resolve: { value: PraticienAdminResolver }
            },
            {
                path: 'messages',
                component: MessagesComponent,
                resolve: { value: MessageAnonymesResolver }
            },
            {
                path: 'update-password',
                component: AccountComponent
            },
            {
                path: 'new-admin',
                component: AddAdminComponent
            },
            {
                path: 'admins',
                component: ListAdminComponent,
                resolve: { value: AdminsListResolver }
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    { path: '**', redirectTo: 'main', pathMatch: 'full' }
];