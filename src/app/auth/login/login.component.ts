import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../models/user.model';
import { FormValidatorsService } from '../../services/form-validators.service';
import { AuthService } from '../../services/auth.service';
import { FormErrorComponent } from '../form-error/form-error.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: String;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      inputEmail: new FormControl(null, [
        Validators.required,
        FormValidatorsService.emailValidator
      ]),
      inputPassword: new FormControl(null,
        Validators.required
      ),
      inputRememberMe: new FormControl(true)
    });
  }

  valid(control) {
    return control.valid || !control.touched;
  }

  onSubmit() {
    const user = new User(this.loginForm.value.inputEmail, this.loginForm.value.inputPassword);
    const remember = this.loginForm.value.inputRememberMe ? true : false;

    this.authService.login(user, remember)
      .subscribe(
      data => {
        this.errorMessage = null;
        this.router.navigateByUrl('/');
      },
      error => { this.errorMessage = error.error.message }
      );
    this.loginForm.reset();
  }
}