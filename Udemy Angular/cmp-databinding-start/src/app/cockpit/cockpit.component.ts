import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css']
})
export class CockpitComponent implements OnInit {
  @Output() serverAdded = new EventEmitter<{serverName: string, serverContent: string}>();
  @Output() blueprintAdded = new EventEmitter<{serverName: string, serverContent: string}>();
  @ViewChild('serverContentInput') serverContentInput: ElementRef;
  constructor() { }

  ngOnInit() {
  }

  onAddServer(nameInput) {
    this.serverAdded.emit({
      serverName: nameInput,
      serverContent: this.serverContentInput.nativeElement.value
    });
  }

  onAddBlueprint(nameInput) {
    this.blueprintAdded.emit({
      serverName: nameInput,
      serverContent: this.serverContentInput.nativeElement.value
    });
  }



}
