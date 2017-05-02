import { Component, Input } from '@angular/core';

import { Message } from '../../models/message.model';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['message.component.scss']
})
export class MessageComponent {
  @Input() message: Message;
  now = Date.now();

  constructor(private messageService: MessagesService) { }

  isMe() {
    return MessagesService.myId == (this.message ? this.message.userId : null);
  }

  getProfileImgUrl() {
    return '/api/user/profile/' + (this.message ? this.message.userId : null);
  }

  getTimeStr() {
    if (!this.message) return null;

    var seconds = (this.now - this.message.time) / 1000;
    if (seconds < 5) return 'now';
    if (seconds < 60) return Math.floor(seconds) + ' sec';

    var minutes = seconds / 60;
    if (minutes < 60) return Math.floor(minutes) + ' min';

    var hours = minutes / 60;
    if (hours < 24) return Math.floor(hours) + ' hr';

    var days = hours / 24;
    if (days < 7) return Math.floor(days) + ' d';

    var weeks = days / 7;
    if (weeks < 3) return Math.floor(weeks) + ' w';

    return new Date(this.message.time).toLocaleDateString();
  }
}