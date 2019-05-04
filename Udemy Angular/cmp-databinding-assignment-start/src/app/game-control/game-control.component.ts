import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css']
})
export class GameControlComponent implements OnInit {
  @Output() numberGenerated = new EventEmitter<number>();
  gameInSession = false; // If start button pressed twice, stop button won't stop game. This ensures games is stopped.
  incrementer = 1;
  intervalRef;
  constructor() {
  }

  ngOnInit() {
  }

  onStart() {
    if (!this.gameInSession) {
      let self = this;
      this.intervalRef = setInterval(function () {
                                        self.numberGenerated.emit(self.incrementer);
                                        self.incrementer++; },
        1000);
      this.gameInSession = true;
    }
  }

  onStop() {
    clearInterval(this.intervalRef);
    this.gameInSession = false;
  }

}
