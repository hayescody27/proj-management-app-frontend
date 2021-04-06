import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  showMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private breakpointObserver: BreakpointObserver, public userSvc: UserService, private router: Router) {
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
