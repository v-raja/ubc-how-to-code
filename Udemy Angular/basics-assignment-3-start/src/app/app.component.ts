import { Component } from '@angular/core';
import {timestamp} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  buttonState = true;
  incrementer = 1;
  timeClicked = [];

  onButtonClick() {
    this.buttonState = !this.buttonState;
    this.timeClicked.push(this.incrementer);
    this.incrementer++;
  }

  getBackgroundColor() {
    return (this.incrementer > 5) ? 'blue' : 'white';
  }
}
