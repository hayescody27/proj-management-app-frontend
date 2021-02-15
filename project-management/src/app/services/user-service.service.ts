import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    if (!environment.production) {
      this.loggedIn$.next(true);
    }

  }

  login(creds) {
    console.log(creds);
    this.loggedIn$.next(true);
  }

  register(creds) {
    console.log(creds);
    this.loggedIn$.next(true);
  }

  logout() {
    this.loggedIn$.next(false);
  }
}
