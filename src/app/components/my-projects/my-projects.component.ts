import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Project } from 'src/app/entities/project';
import { ProjectService } from 'src/app/services/project-service.service';
import { UserService } from 'src/app/services/user-service.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyProjectsComponent implements OnInit {

  projects: Project[] = [];

  constructor(public projectSvc: ProjectService, private dialog: MatDialog, private snackBar: MatSnackBar, private router: Router) {

  }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.projectSvc.getProjects().subscribe((x: Project[]) => {
      this.projects = x;
    })
  }

  viewProject(project) {
    this.router.navigate(['/project-overview'], { queryParams: { id: project._id } });
  }

  monitorProject(project) {
    this.router.navigate(['/project-tracking'], { queryParams: { id: project._id } });
  }

  deleteProject(project) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Delete Project',
        message: 'Are you sure?'
      }
    })

    dialogRef.afterClosed().subscribe(x => {
      if (x) {
        this.projectSvc.deleteProject(project._id).subscribe(x => {
          this.getProjects();
        }, err => {
          let msg = '';
          if (err.error.message instanceof Array) {
            msg = err.error.message[0];
          } else {
            msg = err.error.message;
          }
          this.snackBar.open(msg, null, {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });
        })
      }
    })

  }

}
