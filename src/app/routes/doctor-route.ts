import { Routes } from "@angular/router";
import { AccountComponent } from '../components/doctor/account/account.component';
import { TraitementComponent } from '../components/doctor/traitement/traitement.component';
import { ProfileComponent } from '../components/doctor/profile/profile.component';
import { TraitementDetailsComponent } from '../components/doctor/traitement-details/traitement-details.component';
import { DoctorComponent } from '../components/doctor/doctor.component';
import { AddTraitementResolver } from '../components/doctor/traitement/add-traitement.resolver';
import { ProfileResolver } from '../components/doctor/profile/profile.resolver';
import { EditPasswordComponent } from '../components/doctor/edit-password/edit-password.component';
import { TraitementsResolver } from '../components/doctor/account/traitements.resolver';
import { TraitementDetailsResolver } from '../components/doctor/traitement-details/traitement-details.resolver';
import { ContainerResolver } from '../shared/resolver/container.resolver';

export const doctorRoutes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    {
        path: 'main',
        component: DoctorComponent,
        resolve: { value: ContainerResolver },
        children: [
            { path: 'account', component: AccountComponent, resolve: { value: TraitementsResolver } },
            { path: 'profile', component: ProfileComponent, resolve: { value: ProfileResolver } },
            { path: 'traitement', component: TraitementComponent, resolve: { value: AddTraitementResolver } },
            { path: 'traitement/:id', component: TraitementDetailsComponent, resolve: { value: TraitementDetailsResolver } },
            { path: 'edit-password', component: EditPasswordComponent },
            { path: '', redirectTo: 'account', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'main', pathMatch: 'full' }
];
