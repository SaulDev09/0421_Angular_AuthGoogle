import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import * as firebase from 'firebase';
import { WindowService } from '../window.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  phoneNumber: string;
  windowRef: any;
  verificationCode: string;
  user: any;

  constructor(
    public authService: AuthService,
    private win: WindowService,
    public afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
  }

  sendLoginCode(): void {
    this.afAuth.auth.signInWithPhoneNumber(this.phoneNumber, this.windowRef.recaptchaVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
      })
      .catch(error => console.log('error - send code', error));
  }

  verifyLoginCode(): void {
    this.windowRef.confirmationResult.confirm(this.verificationCode)
      .then(result => {
        this.user = result.user;
      })
      .catch(error => console.log('error - verif code: ', error));
  }
}
