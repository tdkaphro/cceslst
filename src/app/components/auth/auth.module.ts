import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { AuthComponent } from './auth.component';
import { ForgotPasswordPopupComponent } from './forgot-password-popup/forgot-password-popup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthComponent,
    ForgotPasswordPopupComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    SharedMaterialModule
  ],
  entryComponents: [ForgotPasswordPopupComponent]
})
export class AuthModule { }
