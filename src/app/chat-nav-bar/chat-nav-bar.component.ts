import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import * as _ from 'lodash';

import { ThreadsService } from './../thread/threads.service';
import { MessagesService } from './../message/messages.service';

import { Thread } from './../thread/thread.model';
import { Message } from './../message/message.model';

/**
 * a.  We are using the combineLatest callback function to return an array with currentThread and messages as its two elements.
 * b. Then we subscribe to that stream and we are destructuring those objects in the function call. 
 *  b1. We then call reduce over the messages and count the number of messages that are unread and not in the current thread.
 */

@Component({
  selector: 'chat-nav-bar',
  templateUrl: './chat-nav-bar.component.html',
  styleUrls: ['./chat-nav-bar.component.css']
})
export class ChatNavBarComponent implements OnInit {
  unreadMessagesCount: number;

  constructor(public messagesService: MessagesService,
    public threadsService: ThreadsService) {
  }

  ngOnInit(): void {
    this.messagesService.messages // (a)
      .combineLatest(
        this.threadsService.currentThread,
        (messages: Message[], currentThread: Thread) =>
          [currentThread, messages])

      .subscribe(([currentThread, messages]: [Thread, Message[]]) => {
        this.unreadMessagesCount =
          _.reduce(
            messages,
            (sum: number, m: Message) => {
              const messageIsInCurrentThread: boolean = m.thread &&
                currentThread &&
                (currentThread.id === m.thread.id);
              // note: in a "real" app you should also exclude
              // messages that were authored by the current user b/c they've
              // already been "read"
              if (m && !m.isRead && !messageIsInCurrentThread) {
                sum = sum + 1;
              }
              return sum;
            },
            0);
      });
  }
}
