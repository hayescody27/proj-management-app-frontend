import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  emailSignIn: FormGroup;
  emailSignUp: FormGroup;
  signInErrMsg: string = '';
  registerErrMsg: string = '';
  hide: boolean = true;
  rPwdHide: boolean = true;
  rConfirmPwdHide: boolean = true;

  constructor(private fb: FormBuilder, public userSvc: UserService) {

  }

  ngOnInit(): void {

    this.emailSignIn = this.fb.group({
      signInOption: ['username'],
      uid: ['', [Validators.required]],
      password: ['', Validators.required]
    })
    this.emailSignUp = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(22)]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), this.confirmPasswordValidator.bind(this)]]
    })
  }

  confirmPasswordValidator(fieldControl: FormControl) {
    if (this.emailSignUp) {
      return fieldControl.value === this.emailSignUp.get('password').value ? null : { error: 'Passwords do not match.' };
    }
  }

  register() {
    this.registerErrMsg = '';
    this.userSvc.register(this.emailSignUp.value).subscribe(x => {

    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.error.message instanceof Array) {
          this.registerErrMsg = err.error.message[0];
        } else {
          this.registerErrMsg = err.error.message;
        }
      }
    });
  }

  login() {
    this.signInErrMsg = '';
    let creds: any = {
      password: this.emailSignIn.controls['password'].value
    };
    creds[this.emailSignIn.controls['signInOption'].value] = String(this.emailSignIn.controls['uid'].value).toLowerCase();

    this.userSvc.login(creds).subscribe(x => {

    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.error.message instanceof Array) {
          this.signInErrMsg = err.error.message[0];
        } else {
          this.signInErrMsg = err.error.message;
        }
      }
    });
  }

}
