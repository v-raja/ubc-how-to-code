import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { WarningComponent } from './warning/warning.component';
import { SuccessComponent } from './success/success.component';
import { MessagesComponent } from './messages/messages.component';
import { ReverseMessagesComponent } from './reverse-messages/reverse-messages.component';

@NgModule({
  declarations: [
    AppComponent,
    WarningComponent,
    SuccessComponent,
    MessagesComponent,
    ReverseMessagesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
