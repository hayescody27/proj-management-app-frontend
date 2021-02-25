import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from './user-service.service';
import { Router } from '@angular/router';

@Injectable()
export class BearerTokenInterceptor implements HttpInterceptor {

  constructor(private auth: UserService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


    if (this.auth.getToken()) {
      let token = this.auth.getToken();
      let tokenExp = this.auth.decodeToken(token).exp;
      let isTokenExp = this.auth.isTokenExpired(tokenExp);
      if (!isTokenExp) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.auth.getToken()}`
          }
        });
      }
    }

    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {

    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.auth.loggedIn.next(false);
          this.router.navigate(['/login']);
        }
      }
    }))
  }
}
