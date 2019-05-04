import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Anna', 'Mark'];
  takenEmail = ['test@test.com', 'vivek.r.raja@gmail.com'];

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [this.forbiddenUsernameValidator.bind(this), Validators.required]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.takenEmailValidator.bind(this))
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });
  }

  onSubmit() {
    console.log(this.signupForm);
  }

  onAddHobby() {
    const hobby = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(hobby);
  }

  forbiddenUsernameValidator(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'isForbiddenUsername': true};
    }
    return null;
  }

  takenEmailValidator(control: FormControl): Observable<any> | Promise<any> {
    const promise = new Promise( (resolve, reject) => {
      setTimeout( () => {
        if (this.takenEmail.indexOf(control.value) !== -1) {
          resolve({'emailTaken': true});
        } else {
          resolve(null);
        }
      },1500 );
    });
    return promise;
  }
}

