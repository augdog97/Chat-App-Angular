import { TestBed } from '@angular/core/testing';

import {Message} from './message.model';
import {MessagesService} from './messages.service'
import {Thread} from '../thread/thread.model';
import {User} from '../user/user.model';



/** Testing suite to test our messages functionality.
 * a.
 */


describe('MessagesService', () => {
  it('should test', () => {
    const user: User = new User('Nate', 'Nate');
    const thread: Thread = new Thread('t1', 'Nate', '');
    const m1: Message = new Message({
      author: user,
      text: 'HI!',
      thread: thread
    })

    const m2: Message = new Message({
      author: user,
      text: 'BYE!',
      thread: thread
    });
    const messagesService: MessagesService = new MessagesService();

    messagesService.newMessages // listen to each message individually as it comes in
      .subscribe((message: Message) => {
        console.log('=> newMessages' + message.text);
      })

    messagesService.messages // Listen to the stream of most current messages
      .subscribe((message: Message[]) => {
        console.log('=> messages:' + message.length);
      })

    messagesService.addMessage(m1);
    messagesService.addMessage(m2);
  })
 

});
