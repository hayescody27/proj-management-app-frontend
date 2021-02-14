import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {

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
