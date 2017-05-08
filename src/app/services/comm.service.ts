import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';

const NEW_MSG = 'new_msg';

@Injectable()
export class CommService {
  private socket: SocketIOClient.Socket;

  sendMessage(cmd: string, msg: string) {
    this.socket.emit(cmd, msg);
  }

  getMessages() {
    const observable = new Observable(observer => {
      this.socket = io(environment.serverUrl);
      this.socket.on(NEW_MSG, data => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });

    return observable;
  }
}
