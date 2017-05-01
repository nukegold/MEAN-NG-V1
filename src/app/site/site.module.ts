import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SiteComponent } from './site.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MessagesComponent } from '../messages/messages.component'
import { MessageComponent } from '../messages/message/message.component';
import { MessageInputComponent } from '../messages/message-input/message-input.component';
import { MessagesService } from '../services/messages.service';
import { AuthService } from '../services/auth.service';
import { CommService } from '../services/comm.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SiteComponent,
    HeaderComponent,
    FooterComponent,
    MessagesComponent,
    MessageComponent,
    MessageInputComponent
  ],
  providers: [
    AuthService,
    MessagesService,
    CommService
  ]
})
export class SiteModule { }
