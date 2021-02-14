import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project-management';

  constructor(public userSvc: UserService, private router: Router) {
    this.userSvc.loggedIn$.subscribe(l => {
      if (!l) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/my-projects'])
      }
    })
  }
}
