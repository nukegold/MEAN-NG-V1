import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MessagesService } from '../../services/messages.service';
import { Message } from '../../models/message.model';

@Component({
    selector: 'app-message-input',
    templateUrl: './message-input.component.html'
})
export class MessageInputComponent {

    constructor(private messagesService: MessagesService) { }

    onSubmit(form: NgForm) {
        const message = new Message(form.value.content, 'Me');
        this.messagesService.addMessage(message)
            .subscribe(
            data => {},
            error => console.error(error)
        );

        form.resetForm();
    }
}