import { Routes } from "@angular/router";
import { AuthGuardService as AuthGuard } from '../auth/auth-guard.service';
import { AuthNoGuardService as AuthNoGuard } from '../auth/auth-no-guard.service';
import { Role } from '../models/enum/role.enum';
import { PublicContainerComponent } from '../components/public/public-container/public-container.component';
import { VitrineComponent } from '../components/public/vitrine/vitrine.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'public', pathMatch: 'full' },
  {
    path: 'public',
    component: PublicContainerComponent,
    children: [
      { path: 'main', component: VitrineComponent },
      { path: '', redirectTo: 'main', pathMatch: 'full' }
    ]
  },
  {
    path: 'auth',
    loadChildren: './components/auth/auth.module#AuthModule',
    canActivate: [AuthNoGuard]
  },
  {
    path: 'admin',
    loadChildren: './components/admin/admin.module#AdminModule',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  {
    path: 'praticien',
    loadChildren: './components/doctor/doctor.module#DoctorModule',
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'public', pathMatch: 'full' }
];