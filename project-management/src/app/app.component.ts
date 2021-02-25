import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { UserService } from './services/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project-management';

  showMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public userSvc: UserService, private router: Router) {
    this.userSvc.loggedIn.subscribe(l => {
      if (!l) {
        this.router.navigate(['/login']);
      }
    });

    this.userSvc.profileInfo.subscribe(p => {
      if (p) {
        if (p.displayName && p.displayName !== p.username) {
          this.router.navigate(['my-projects']);
        } else {
          this.router.navigate(['profile-setup']);
        }
      } else {
        if (this.userSvc.loggedIn.getValue()) {
          this.userSvc.getProfileInfo();
        }
      }
    });

    combineLatest([this.userSvc.loggedIn, this.userSvc.validProfile]).subscribe(([li, vp]) => {
      this.showMenu.next(li && vp);
    })

  }

}
