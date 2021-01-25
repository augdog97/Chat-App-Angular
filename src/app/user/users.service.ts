import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import {User} from '../user/user.model';


/** The main function of this service is to provide a place where out application can learn about the current user and to notify the rest of the application if the current user changes.
 * a. Setting up a stream to manage the current user.
 *    - 1st we are defining an instance variable "currentUser" which is a Subject stream.
 *      - Subject is a "read/write" stream. Inherits from both Observable and Observer.
 *    - 2nd concretely, currentUser is a behaviorSubject which will contain User. 
 *      - BehaviorSubject is used becasue it has a special property that stores the last value. Any subscriber to the stream will receive the latest value. We can now subscribe to UsersService.currentUser stream and know who the current user is.
 *    - however the first value of this stream is null (the constructor argument)
 * a1. .next on a Subject pushes a new value to the stream. 
 *    - implmenting next in the setCurrentUser call is to give some room to change the implementation of the UsersService without breakling our clients.  
 */

@Injectable({
  providedIn: 'root'
})
export class UsersService {
// 'currentUser' contains the current user
currentUser: Subject<User> = new BehaviorSubject<User>(null); // (a)
public setCurrentUser(newUser:User):void { // (a1)
  this.currentUser.next(newUser);
}

  constructor() { }
}