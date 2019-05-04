import * as firebase from 'firebase';
import {Injectable, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataStorageService} from '../shared/data-storage.service';
import {AppComponent} from '../app.component';
import {Subject} from 'rxjs';

@Injectable()
export class AuthService implements OnInit {n
  userToSignIn = new Subject<{email: string, password: string}>();
  token = '';

  ngOnInit() {
    this.userToSignIn.subscribe( response => )
  }

  signupUser(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch( error => console.log(error) );
  }

  signinUser(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then( response => {
        firebase.auth().currentUser.getIdToken()
          .then( token => this.token = token);
          return response;
        }
      )
      .catch(error => console.log(error) );
  }


  getToken() {
    if (firebase.auth().currentUser == null) {
      console.log(' no user loaded ');
      this.token = null;
    } else {
      firebase.auth().currentUser.getIdToken()
        .then(token => this.token = token);
    }

    return this.token;
  }
}
