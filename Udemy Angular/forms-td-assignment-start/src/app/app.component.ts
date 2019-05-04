import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subsctiptions = ['Basic', 'Advanced', 'Pro'];
  defaultSubsctiption = 'Advanced';
  submitted = false;
  @ViewChild('formElement') formElement;
  input = {
    email: '',
    subscription: '',
    password: ''
  };

  onSubmit() {
    this.submitted = true;
    this.input.email = this.formElement.value.email;
    this.input.subscription = this.formElement.value.subscription;
    this.input.password = this.formElement.value.password;

    this.formElement.reset();
  }


}

