import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AuthRoutingModule } from './auth-routing.module';
import { FormValidatorsService } from '../services/form-validators.service';
import { AuthService } from '../services/auth.service';

import { FormErrorComponent } from './form-error/form-error.component';
import { FormMessageComponent } from './form-message/form-message.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    HttpModule
  ],
  declarations: [
    FormErrorComponent,
    FormMessageComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    RecoverPasswordComponent
  ],
  providers: [
    FormValidatorsService,
    AuthService
  ]
})
export class AuthModule { }
