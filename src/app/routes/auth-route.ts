import { Routes } from "@angular/router";
import { LoginComponent } from '../components/auth/login/login.component';
import { RegisterComponent } from '../components/auth/register/register.component';
import { AuthComponent } from '../components/auth/auth.component';
import { ResetPasswordComponent } from '../components/auth/reset-password/reset-password.component';

export const authRoutes: Routes = [
    { path: '', redirectTo: 'user', pathMatch: 'full' },
    {
        path: 'user',
        component: AuthComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'reset-password/:token', component: ResetPasswordComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'user', pathMatch: 'full' }
];