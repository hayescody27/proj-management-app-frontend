import { Component, Renderer2 } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { setupTestingRouter } from '@angular/router/testing';

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
  isDark: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(localStorage.getItem('theme') === 'dark');

  constructor(private breakpointObserver: BreakpointObserver, public userSvc: UserService, private router: Router, private renderer: Renderer2) {
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
    });

    this.isDark.subscribe(x => {
      this.setTheme(x);
    })
  }

  setTheme(isDark) {
    if (isDark) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

}
