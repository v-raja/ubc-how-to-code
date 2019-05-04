import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  statuses = ['Stable', 'Critical', 'Finished'];
  projectForm: FormGroup;
  takenName = ['Test'];

  ngOnInit() {
    this.projectForm = new FormGroup({
      'name': new FormControl(null, [Validators.required], this.takenProjectNameValidator.bind(this)),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'status': new FormControl('Stable')
    });
  }

  takenProjectNameValidator(control: FormControl): Observable<any> | Promise<any> {
    const promise = new Promise( (resolve, reject) => {
      setTimeout( () => {
        if (this.takenName.indexOf(control.value) !== -1) {
          resolve({'nameTaken': true});
        } else {
          resolve(null);
        }
      },1500);
    });
    return promise;
  }

  onSubmit() {
    console.log(this.projectForm);
  }
}
