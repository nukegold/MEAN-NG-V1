export class Message {
    time: number;
    content: string;
    username: string;
    messageId?: string;
    userId?: string;

    constructor(
        content: string,
        username: string,
        messageId?: string,
        userId?: string,
        time?: string) {
        this.time = Date.parse(time) || Date.now();
        this.content = content;
        this.username = username;
        this.messageId = messageId;
        this.userId = userId;
    }
}
