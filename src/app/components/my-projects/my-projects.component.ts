import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  selectedProject: Project;

  constructor(public projectSvc: ProjectService, private dialog: MatDialog, private snackBar: MatSnackBar) {

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
    this.projectSvc.openProject(project);
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
          this.snackBar.open(err.error.message[0], null, {
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
