import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter, map, scan} from 'rxjs/operators';
import {Message} from '../message/message.model';
import { User } from '../user/user.model';
import {Thread} from '../thread/thread.model';
import {publishReplay, refCount} from 'rxjs/operators';

/**
 * a. A stream that publishes new messages only once.
 *    - Creating an "action" stream. Still a regular Subject its just a way to describe the role in the service.
 * b. A helper method that adds Messages to the stream.
 * c. A stream that gathers all of the messages from a thread that are not from a particular user.
 *    - This is saying, for a given Thread I want a stream of the messages that are "for" this User.
 *  c1. messagesForThreadUser takes a Thread and a User and returns a new stream of Messages that are filtered on that Thread and not authored by the User. In other words, it is a stream of "everyone elses" messages in this Thread.
 * d. messages stream emits an Array of the most recent messages.
 *  - This stream emits an Array of messages, not individual messages.
 * e. The interface is a function that is put on the "updates stream" and it accepts a list of Messages and then returns a list of Messages. 
 * f. "updates" receives_operations_ to be applied to our messages. Its a way we can perform changes on all of the messages that are currently store in "messages"
 * g. In the constructor we watch the updates and accumulate operations on the messages and we make sure that we can share the most recent list of messages across anyone whos interested in subscribing and cache the last known list of messages.
 *    - .scan is similare to the reduce method. It runs the function for each element i nthe incoming stream and accumulates a value. .scan temits a value for each intermediate result. We dont have to wait for the stream to complete before emitted a result.
 *      - This means when we call this.updates.scan we are creating a new stream that is subscribed to the updates stream and on each pass we are given 1. the messages we are accumulating and 2. the new operation to apply and then we return the new Message[].
 *    - publishReplay lets us share a subscription between multiple subscribers and replay "n" number of values to future subscribers.
 *    - refCount makes it easier to use the return value of pbulish by managing when the observable will emit values.
 * h. Using the .map operator to emit the return value of the function.
 *    - We are saying for each Message we receive as input, return an IMessagesOperation that adds this message to the list.
 *    - This stream will emit a function which accepts the list of Messages and adds this Message to our list of messages.
 *  h1. Subscribing to the updates stream to listen to the create stream. 
 *      - if create receives a Message it will emit an IMessagesOperation that will be received by updates and then the Message will be added to messages. 
 *  h2. Subscribe to the stream of individual messages through newMessages, but if we just want the most up to date list, we can subscribe to messages.
 * I. takes a Thread and then puts an operation on the updates stream to mark the Messaegs as read.
 *    I1. We are manipulating message directly here. Mutability can be confusing and there are lots of reasons why you might want to say copy the Message object or some other "immutable" here.
 */

 
const initialMessages: Message[] = [];

interface IMessagesOperation extends Function { // (e)
  (messages: Message[]): Message[];
}


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  newMessages: Subject<Message> = new Subject<Message>(); // (a)
  updates: Subject<any> = new Subject<any>(); // (f)
  messages: Observable<Message[]>; // (d)
  // action streams
  create: Subject<Message> = new Subject<Message>(); // (a1)
  markThreadAsRead: Subject<any> = new Subject<any>();

  
  
  constructor() {
    this.messages = this.updates // (g)
      .pipe(scan((messages: Message[],
        operation: IMessagesOperation) => {
        return operation(messages);
      },initialMessages))
      .pipe(
        publishReplay(1), // (g1)
        refCount()
        )
        
      
      
    this.create // (h)
      .pipe(map(function (message: Message): IMessagesOperation {
        return (messages: Message[]) => {
          return messages.concat(message);
        };
      }))
    .subscribe(this.updates); // (h1)

    this.newMessages
    .subscribe(this.create); // (h2)

    this.markThreadAsRead // (I)
      .pipe(map((thread: Thread) => {
        return (messages: Message[]) => {
          return messages.map((message: Message) => {
            // (I1)
            if (message.thread.id === thread.id) {
              message.isRead = true;
            }
            return message;
          });
        };
      }))
    .subscribe(this.updates);
   }

  addMessage(message: Message): void { // (b)
    this.newMessages.next(message);
  }
  messagesForThreadUser(thread: Thread, user: User): Observable<Message> { // (c)
    return this.newMessages
      .pipe(
        filter((message: Message) => { // (c1)
        return (message.thread.id == thread.id) &&
          (message.author.id !== user.id);
      }))
  }
}
export const messagesServiceInjectables: Array<any> = [
  MessagesService
];