import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Project } from 'src/app/entities/project';
import { ProjectService } from 'src/app/services/project-service.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  newProjectForm: FormGroup;

  constructor(private fb: FormBuilder, private projSvc: ProjectService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.newProjectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(128), Validators.minLength(4)]],
      description: ['', [Validators.required, Validators.maxLength(512), Validators.minLength(4)]],
    })
  }

  createProject() {
    this.projSvc.createProject(this.newProjectForm.value).subscribe((x: Project) => {

      this.router.navigate(['/project-overview'], { queryParams: { id: x._id } });

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
    });
  }

}
