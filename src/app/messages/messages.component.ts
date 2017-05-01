import { Component, OnInit } from '@angular/core';

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
export class MessagesComponent implements OnInit {
    messages: Message[];
    connection;

    constructor(private messageService: MessagesService, private commService: CommService) { }

    ngOnInit() {
        this.messageService.getMessages()
            .subscribe(
            data => {
                MessagesService.myId = data.myId;
                this.messages = data.messages;
            });

        this.connection = this.commService.getMessages()
            .subscribe(data => {
                var msg = data['message'];
                this.messages.push(
                    new Message(
                        msg['content'],
                        msg['user']['generalInfo'].fullName,
                        msg['_id'],
                        msg['user']['_id'],
                        msg['time']));
            });
    }
}
