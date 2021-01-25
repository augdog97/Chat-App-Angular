import {uuid} from '../util/uuid';

// A user represents an agent that sends messages. 

/**
 * a. In the constructor we are using typescript shorthand. When saying public name: string we are saying that 
 *      1. we want the name to be a public property on this class and
 *      2. assign the argument value to that property when a new instance is created.
 */

export class User {
    id: string;

    constructor(public name: string, public avatarSrc: string) { // (a)
        this.id = uuid();
    }
}