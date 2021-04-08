import { Component, Renderer2 } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
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

  darkMode: Subject<boolean> = new Subject<boolean>();
  showMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private breakpointObserver: BreakpointObserver, public userSvc: UserService, private router: Router, private renderer: Renderer2) {
    this.userSvc.loggedIn.subscribe(l => {
      if (!l) {
        this.router.navigate(['/login']);
      }
    });

    this.darkMode.subscribe(x => {
      if (x) {
        this.renderer.addClass(document.body, 'dark-theme');
        this.renderer.removeClass(document.body, 'light-theme');
      } else {
        this.renderer.addClass(document.body, 'light-theme');
        this.renderer.removeClass(document.body, 'dark-theme');
      }
    })

    let theme = localStorage.getItem('theme');

    if (theme != null) {
      this.darkMode.next(theme === 'dark');
    } else {
      this.darkMode.next(false);
      localStorage.setItem('theme', 'light');
    }

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
