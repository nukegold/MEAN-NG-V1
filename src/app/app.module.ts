import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SiteComponent } from './site/site.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageComponent } from './messages/message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    SiteComponent,
    MessagesComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
