import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  emailSignIn: FormGroup;
  emailSignUp: FormGroup;

  constructor(private fb: FormBuilder, public userSvc: UserService) {

  }

  ngOnInit(): void {
    this.emailSignIn = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    })
    this.emailSignUp = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, this.confirmPasswordValidator.bind(this)]]
    })
  }

  confirmPasswordValidator(fieldControl: FormControl) {
    if (this.emailSignUp) {
      return fieldControl.value === this.emailSignUp.get('password').value ? null : { error: 'Passwords do not match.' };
    }
  }

}
