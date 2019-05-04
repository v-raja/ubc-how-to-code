import {Component, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  genders = ['male', 'female'];
  defaultQuestion = 'teacher';
  answer = 'Nelly';
  @ViewChild('formElement') form;
  submitted = false;
  user = {
    username: '',
    email: '',
    question: '',
    answer: '',
    gender: ''
  }

  suggestUserName() {
    const suggestedName = 'Superuser';
    this.form.form.patchValue({
    userData: {
      username: suggestedName
    }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.user.username = this.form.value.userData.username;
    this.user.email = this.form.value.userData.email;
    this.user.question = this.form.value.secret;
    this.user.answer = this.form.value.answer;
    this.user.gender = this.form.value.gender;

    this.form.reset();
  }
}
