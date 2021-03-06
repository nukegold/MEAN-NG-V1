import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { Message } from '../models/message.model';

@Injectable()
export class MessagesService {
  static myId: string = null;
  private messages: Message[] = [];

  constructor(private http: Http) {
  }

  addMessage(message: Message) {
    const body = JSON.stringify(message);
    const headers = new Headers({ 'Content-Type': 'application/json' });

    return this.http.post('/api/message', body, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        console.error(error.json());
        return Observable.throw(error.json());
      });
  }

  getMessages() {
    return this.http.get('/api/message')
      .map((response: Response) => {
        const data = response.json();
        const transformedMessages: Message[] = [];
        for (const message of data.obj.messages) {
          transformedMessages.push(new Message(
            message.content,
            message.user.generalInfo.fullName,
            message._id,
            message.user._id,
            message.time)
          );
        }
        this.messages = transformedMessages;
        return { myId: data.obj.myId, messages: transformedMessages };
      })
      .catch((error: Response) => {
        console.error(error.json());
        return Observable.throw(error.json());
      });
  }
}
