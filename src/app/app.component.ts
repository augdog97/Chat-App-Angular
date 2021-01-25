import { Component, Inject} from '@angular/core';
// Example Data
import {ChatExampleData} from './data/chat-example-data';

// Services
import {UsersService} from './user/users.service';
import {ThreadsService} from './thread/threads.service';
import {MessagesService} from './message/messages.service';

/**
 * a. Injecting our three servcies and using those services to initialize our example data.
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public messagesService: MessagesService, public usersService: UsersService, public threadsService:ThreadsService) { // (a)
    ChatExampleData.init(messagesService, threadsService, usersService);
  }
}
