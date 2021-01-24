import {User} from '../user/user.model';
import {Thread} from '../thread/thread.model';
import {uuid} from '../util/uuid';

/** Message represents on message being sent in a Thread
 * a. The pattern in the constructor allows us to simulate using keyword arguments in the constructor.
 *      - Using this pattern, we can create a new Message using whatever data we hae available and we dont have to worry about the order of the arguments.
 */

export class Message {
    id: string;
    sentAt: Date;
    isRead: boolean;
    author: User;
    text: string;
    thread: Thread;

    constructor(obj?: any) { // (a)
        this.id     =       obj && obj.id       || uuid();
        this.isRead =       obj && obj.isRead   || false;
        this.sentAt =       obj && obj.sentAt   || new Date();
        this.author =       obj && obj.author   || null;
        this.text   =       obj && obj.text     || null;
        this.thread =       obj && obj.thread   || null;
    }
}
