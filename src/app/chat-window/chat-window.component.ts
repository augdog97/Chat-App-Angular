import { Component, OnInit, ElementRef } from '@angular/core';
import {Observable} from 'rxjs';

// Services 
import {MessagesService} from '../message/messages.service';
import {Message} from '../message/message.model';
import { Thread } from '../thread/thread.model';
import {ThreadsService} from '../thread/threads.service';
import { User } from '../user/user.model';
import {UsersService} from '../user/users.service';

/**
 * a. using ElementRef to access to the host DOM element, we will use this when we scroll to the bottom of the chat window when we create and recieve new messages.
 *  a1. By using public messgeservices in the constructor we are not onyl injecting the service but are setting up an instance variable that we can use later on in our class via "this.messagesService"
 * b. Save the currentThreadMessages into messages and then create an empty Message for the defualt draftMessage.
 * c. When a new message is sent we need to make sure tat Message stores a reference to the sending Thread. THe sending Thread is always going to be the current thread, so we store a reference to the currently selected thread.
 * d. We want new messages to be sent from the current user.
 * e. The function takes the draftMessage, sets the author and thead using the component properties. Every message we send has "been read" because we wrote it so we mark it as read.
 *      - After we have updated the draftMessage properties we send it off to the messagesService and then create a new message and set that new Message to this.draftMessage. This is done to make sure we dont mutate an already sent message.
 * f. The function that sends the message when the user hits the enter button.
 * g. When a message is sent or when a new message comes in we want to scroll to the bottom of the chat window. We do this by setting the scrollTop property of our host element.
 *  g1. We are subscribing to the currentThreadMesages and we scroll to the bottom anytime that we get a new message.
 *      - When we use setTimeout we are telling JS that we want to run this function when it is finished with the current execution queue. This happens AFTER the component is rendered, so it does what we want.
 */

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
messages: Observable<any>;
currentThread: Thread;
draftMessage: Message;
currentUser: User;
constructor(public messagesService: MessagesService, public userService: UsersService, public threadsService: ThreadsService, public el: ElementRef) { // (a)/ (a1)

}

  ngOnInit(): void {
    this.messages = this.threadsService.currentThreadMessages; // (b)
    this.draftMessage = new Message();
    this.threadsService.currentThread.subscribe((thread: Thread)=> { // (c)
      this.currentThread = thread; 
    })
    this.userService.currentUser // (d)
    .subscribe((user:User)=> { 
      this.currentUser = user;
    })
    this.messages // (g1)
    .subscribe((messages: Array<Message>)=> { 
      setTimeout(()=> {
        this.scrollToBottom();
      })
    })
  }
sendMessage():void { // (e)
const m: Message = this.draftMessage;
m.author = this.currentUser;
m.thread = this.currentThread;
m.isRead = true;
this.messagesService.addMessage(m);
this.draftMessage = new Message();
}
onEnter(event: any): void { // (f)
  this.sendMessage();
  event.preventDefault();
}

scrollToBottom(): void { // (g)
  const scrollPane: any = this.el
  .nativeElement.querySelector(".msg-container-base");

  scrollPane.scrollTop = scrollPane.scrollTop;
}

}
