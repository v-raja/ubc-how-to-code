import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseMessagesComponent } from './reverse-messages.component';

describe('ReverseMessagesComponent', () => {
  let component: ReverseMessagesComponent;
  let fixture: ComponentFixture<ReverseMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReverseMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReverseMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
