import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'profile-setup',
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.scss']
})
export class ProfileSetupComponent implements OnInit {

  profileSetupForm: FormGroup;
  errMsg: string = '';

  constructor(private fb: FormBuilder, public userSvc: UserService) { }

  ngOnInit(): void {

    this.profileSetupForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]]
    })
  }

  updateProfile() {
    this.userSvc.updateProfile(this.profileSetupForm.value);
  }

}
