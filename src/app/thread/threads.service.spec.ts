import { TestBed } from '@angular/core/testing';

// Service imports
import { ThreadsService } from './threads.service';
import {MessagesService } from '../message/messages.service';

// Model Imports 
import {Message} from '../message/message.model';
import {Thread} from '../thread/thread.model';
import {User} from '../user/user.model';

import * as _ from 'lodash';

/** 
 * a. Creating Users for our test case.
 * b. Creating Threads for our test cases. 
 * c. Creating a new message and assignign a use, a message text, and a thread for the test case.
 * d. Creating an instance of our services.
 *    - d1. Passing messagesService as an argument to the constructor of our ThreadsService.
 *        - Usually we let DI system handle this for us, but in the test we can provide the dependencies ourselves. 
 *    - d2. Subscribing to the threads and logging out what comes through.
*/

describe('ThreadsService', () => {
  it('should collect the Threads from Messages', () => {

    const nate: User = new User('Nate Murray', ''); // (a)
    const felipe: User = new User('Felipe Coury', '');

    const t1: Thread = new Thread('t1', 'Thread 1', ''); // (b)
    const t2: Thread = new Thread('t2', 'Thread 2', '');

    const m1: Message = new Message({ // (c)
      author: nate,
      text: 'Hi!',
      thread: t1
    });

    const m2: Message = new Message({
      author: felipe,
      text: 'Where did you get that hat?',
      thread: t1
    });

    const m3: Message = new Message({
      author: nate,
      text: 'Did you bring the briefcase?',
      thread: t2
    });

    const messagesService: MessagesService = new MessagesService(); // (d)
    const threadsService: ThreadsService = new ThreadsService(messagesService); // (d1)

    threadsService.threads // (d2)
      .subscribe((threadIdx: { [key: string]: Thread }) => {
        const threads: Thread[] = _.values(threadIdx);
        const threadNames: string = _.map(threads, (t: Thread) => t.name)
          .join(', ');
        console.log(`=> threads (${threads.length}): ${threadNames} `);
      });

    messagesService.addMessage(m1);
    messagesService.addMessage(m2);
    messagesService.addMessage(m3);

    // => threads (1): Thread 1
    // => threads (1): Thread 1
    // => threads (2): Thread 1, Thread 2

  });
});
