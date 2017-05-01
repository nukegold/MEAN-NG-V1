import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  template: `
        <nav class="navbar navbar-inverse bg-inverse navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navOptions">
                        <span class="icon-bar"></span>                      
                        <span class="icon-bar"></span>                      
                        <span class="icon-bar"></span>                      
                    </button>
                    <a href="#" class="navbar-brand"><span class="glyphicon glyphicon-comment"></span> MEAN-NG Messager</a>
                </div>
                <div class="collapse navbar-collapse" id="navOptions">
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="#"><span class="glyphicon glyphicon-user"></span> Hi {{user.name}}!</a></li>
                    <li><a href="#" (click)="logout()"><span class="glyphicon glyphicon-log-out"></span> Log out</a></li>
                </ul>
                </div>
            </div>
        </nav>
    `,
  styles: ['nav { min-width: 350px }']
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {
    this.getUser();
  }

  logout() {
    this.authService.logout().subscribe();
    this.router.navigateByUrl('/auth/login');
  }

  user = { name: '...' };

  getUser() {
    this.authService.getUser().subscribe(
      data => {
        this.user = data.obj;
      },
      error => {
        if (error.status === 401) this.logout();
        else {
          console.error(error);
        }
      }
    );
  }
}