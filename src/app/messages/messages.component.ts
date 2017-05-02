import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { Message } from '../models/message.model';
import { MessagesService } from '../services/messages.service';
import { CommService } from '../services/comm.service';

@Component({
  selector: 'app-messages',
  template: `
        <div class="msg_container_base">
            <app-message [message]="message" *ngFor="let message of messages"></app-message>
        </div>`,
  styles: [`
        .msg_container_base {
            margin: 50px 0 100px 0;
            padding: 0 5px;
            overflow-x: hidden;
        }
    `]
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  messages: Message[];
  private needToScroll = false;

  constructor(private messageService: MessagesService, private commService: CommService) { }

  ngOnInit() {
    this.messageService.getMessages()
      .subscribe(
      data => {
        MessagesService.myId = data.myId;
        this.messages = data.messages;
        this.needToScroll = true;
      });

    this.commService.getMessages()
      .subscribe(data => {
        var msg = data['message'];
        this.messages.push(
          new Message(
            msg['content'],
            msg['user']['generalInfo'].fullName,
            msg['_id'],
            msg['user']['_id'],
            msg['time']));

        this.needToScroll = true;
      });
  }

  private timeout = null;
  private lastItem = null;
  public ngAfterViewChecked(): void {
    /* need _canScrollDown because it triggers even if you enter text in the textarea */

    let currentLastItem = this.messages ? this.messages[this.messages.length - 1] : null;
    if (currentLastItem && this.lastItem !== currentLastItem) {
      this.lastItem = currentLastItem;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        let body = document.body;
        body.scrollTop = body.scrollHeight - 100;
      }, 500)

    }
  }
}
