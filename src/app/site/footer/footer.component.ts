import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
        <nav class="navbar navbar-inverse bg-inverse navbar-fixed-bottom">
            <div class="container">
                <app-message-input></app-message-input>
            </div>
        </nav>
    `,
  styles: ['nav { min-width: 350px }']
})
export class FooterComponent {
  constructor() {
  }
}