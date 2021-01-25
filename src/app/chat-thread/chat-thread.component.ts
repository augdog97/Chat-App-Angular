import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs';

// services
import {ThreadsService} from '../thread/threads.service';
import {Thread} from '../thread/thread.model';

/**
 * a. NgOninit will be called on our component after the componet has been checked for changes for the first time.
 *    - We use Ngoninit becuase our thread property wont be available in the constructor.
 *  a1. subscribe to threadsService.currentThread and if the currentThread matches the thread property of this component, we selected to true and vice versa.
 * b. Set up a click event handler. This is how we handle selecting the current thread. We bind clicked to clicking on the thread view. If we recieve clicked() then we tell the threadsService we want to set the current thread to the Thread of this componet. 
 */

@Component({
  selector: 'chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.css']
})
export class ChatThreadComponent implements OnInit {
@Input() thread: Thread;
selected = false;
  constructor(public threadsService: ThreadsService) {

   }

  ngOnInit(): void {
    this.threadsService.currentThread
    .subscribe((currentThread: Thread)=> {
      this.selected = currentThread && 
      this.thread && 
      (currentThread.id == this.thread.id);
    });
  }
  clicked(event: any): void {
    this.threadsService.setCurrentThread(this.thread);
    event.preventDefault();
  }

}
