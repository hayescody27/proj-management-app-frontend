import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string = 'https://sudonimus.com';
  BT_STORAGE_KEY: string = 'bearerToken';
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  validProfile: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  profileInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    if (this.getToken()) {
      if (!this.isTokenExpired(this.decodeToken(this.getToken()).exp)) {
        this.loggedIn.next(true);
      }
    }
    this.profileInfo.subscribe(pi => {
      if (pi) {
        if (pi.username !== pi.displayName) {
          this.validProfile.next(true);
        }
      }
    })

  }

  public getToken(): string {
    return localStorage.getItem(this.BT_STORAGE_KEY);
  }

  decodeToken(token): any {
    let decodedToken = jwtDecode(token);
    return decodedToken;
  }

  isTokenExpired(expTime): boolean {
    return expTime > Date.now();
  }


  register(creds) {
    return this.http.post(`${this.baseUrl}/auth/register`, creds).pipe(
      tap((x: any) => {
        localStorage.setItem(this.BT_STORAGE_KEY, x.accessToken);
        this.loggedIn.next(true);
        this.getProfileInfo();
      })
    );
  }

  login(creds) {
    return this.http.post(`${this.baseUrl}/auth/login`, creds).pipe(
      tap((x: any) => {
        localStorage.setItem(this.BT_STORAGE_KEY, x.accessToken);
        this.loggedIn.next(true);
        this.getProfileInfo();
      })
    );
  }

  logout() {
    this.loggedIn.next(false);
    this.validProfile.next(false);
    localStorage.removeItem(this.BT_STORAGE_KEY);
  }

  getProfileInfo() {
    this.http.get(`${this.baseUrl}/users/${this.decodeToken(this.getToken()).username}`).subscribe((x: any) => {
      this.profileInfo.next(x);
    })
  }

  updateProfile(profileInfo) {
    return this.http.patch(`${this.baseUrl}/users/${this.decodeToken(this.getToken()).username}`, profileInfo).subscribe(x => {
      this.profileInfo.next(x);
    })
  }

  getUsers(username: string) {
    return this.http.get(`${this.baseUrl}/users?name=${username}`);
  }
}
