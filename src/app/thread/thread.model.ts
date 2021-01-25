import {Message} from "../message/message.model";
import {uuid} from "../util/uuid";

/** Thread represents a group of Users exchanging messages
* a. We are storing a reference to the lastMessage in our thread. This will lets us show a preview of the most recent message in the threads lsit. 
 */

 export class Thread {
     id: string;
     lastMessage: Message;
     name: string;
     avatarSrc: string;

     constructor(id?:string, name?: string, avatarSrc?: string) {
         this.id = id || uuid();
         this.name = name
         this.avatarSrc = avatarSrc;
     }
 }