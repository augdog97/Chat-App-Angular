import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatThreadsComponent } from './chat-threads/chat-threads/chat-threads.component';
import { ChatThreadComponent } from './chat-thread/chat-thread.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatThreadsComponent,
    ChatThreadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
