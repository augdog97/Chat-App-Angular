import { Injectable } from '@angular/core';
import {Subject, BehaviorSubject, Observable, combineLatest} from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';

// Model and Service imports
import {Thread} from './thread.model';
import {Message} from '../message/message.model';
import {MessagesService} from '../message/messages.service';

import * as _ from 'lodash';

/**
 * a. "threads" is an observable that contains the most up to date list of threads.
 *    - This stream will emit a map (an object) with the id of the "Thread" being the string key and the "Thread" itself will be the value.
 *  a1. Contains a newest-first chronological list of threads. 
 *  a2. "currentThread" contains the currentlty selected thread.
 *  a3. Contains the set of messages for the currently selected thread.
 * b. We are looking at each Message and returning a unique list of the Threads.
 *    b1. Store the messages thread in our accumulator 'threads'
 *    b2. Creating a new list of threads. The reason that we do this is becasue we might want to delete some messages down the line (like leave a conversation). 
 *        - Becasue we are recalculating the list of threads each time, we naturally will "delete" a thread if it has no messages. 
 * c. Storing the most recent Message for each Thread. This will allow us to show a preview of the chat by using the text of the most recent Message in that Thread.
 *      - We know which Message is newest by comparing the sentAt times 
 * d. subscribing to threads and ordering by the most recent message.
 * e. Defining a helper method that we can use to set the next thread.
 *  e1. Hooking the currentThread and messagesService so that when a thread is selected it will mark those messages as read.
 * f. Combining 2 streams on or the other will arrive first and there is no gurentee that we will have a value on both streams, so we need to check to make sure we have what we need otherwise we will just return an empty list.
 *  f1. Filtering out the messages that we are interested in.
 *  f2. Marking the messages as read. 
 *     - this method is not recommended as it produces a side effect. We are mutating objects in a "read" thread, this is a read operation with a side effect. The "read with side effects" is not a recommended pattern.
 */

@Injectable({
  providedIn: 'root'
})
export class ThreadsService {
threads: Observable<{[key:string]: Thread}>; // (a)
orderedThreads: Observable<Thread[]>; // (a1)
currentThread: Subject<Thread> = new BehaviorSubject<Thread>(new Thread()); // (a2)
currentThreadMessages: Observable<Message[]>; // (a3)

  constructor(public messagesService: MessagesService) { 
    
    this.threads = messagesService.messages // (b)
      .pipe( map((messages: Message[]) => {
        const threads: { [key: string]: Thread } = {}; //(b1)

        messages.map((message: Message) => { // (b2)
          this.threads[message.thread.id] =
            this.threads[message.thread.id] ||
            message.thread;

          const messagesThread: Thread = // (c)
            threads[message.thread.id];
          if (!messagesThread.lastMessage || messagesThread.lastMessage.sentAt < message.sentAt) {
            messagesThread.lastMessage = message;
          }
        });
        return threads;
      }))
      
    this.orderedThreads = this.threads // (d)
      .pipe(map((threadGroups: { [key: string]: Thread }) => {
        const threads: Thread[] = _.values(threadGroups);
        return _.sortBy(threads, (t: Thread) => t.lastMessage.sentAt).reverse();
      }));  

      this.currentThread.subscribe(this.messagesService.markThreadAsRead); // (e1)

    this.currentThreadMessages = this.currentThread // (f)
      .combineLatest(messagesService.messages,
        (currentThread: Thread, messages: Message[]) => {
          if (currentThread && messages.length > 0) {
            return _.chain(messages)
              .filter((message: Message) => // (f1)
                (message.thread.id === currentThread.id))
              .map((message: Message) => {
                message.isRead = true; // (f2)
                return message;
              })
              .value();
          } else {
            return [];
          }
        });
    }

  setCurrentThread(newThread: Thread): void { // (e)
    this.currentThread.next(newThread);
  }
}
