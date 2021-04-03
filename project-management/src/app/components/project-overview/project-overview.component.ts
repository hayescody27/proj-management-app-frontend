import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { RequirementStatusEnum } from 'src/app/entities/requirement-status-enum';
import { KeyValue } from '@angular/common';
import { ProjectService } from 'src/app/services/project-service.service';
import { Project } from 'src/app/entities/project';
import { TeamMember } from 'src/app/entities/team-member';
import { debounce, debounceTime, skip } from 'rxjs/operators';
import { UserService } from 'src/app/services/user-service.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;
  @ViewChild('projectName') projectName: ElementRef<HTMLInputElement>;
  @ViewChild('projectDescription') projectDescription: ElementRef<HTMLInputElement>;
  @ViewChild('projectOwner') projectOwner: ElementRef<HTMLInputElement>;

  allMembers: any[] = [];
  projectDetails: FormGroup;
  addMemberCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  project: Project = <Project>{};
  risksColumns = ['riskDescription', 'riskStatus', 'editRisk', 'deleteRisk'];
  requirementColumns = ['reqDescription', 'reqType', 'reqStatus', 'editReq', 'deleteReq'];

  constructor(public dialog: MatDialog, public http: HttpClient, private projectSvc: ProjectService, public userSvc: UserService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.project = this.projectSvc.projectOverviewPlaceholder;
    this.projectSvc.projectOverviewPlaceholder = null;

    this.addMemberCtrl.valueChanges.pipe(debounceTime(500)).subscribe(x => {
      this.getFilteredUserList();
    });
    let initProjOwner = '';
    this.project.members.forEach(mem => {
      if (mem.uid === this.project.owner) {
        initProjOwner = mem.displayName;
      }
    })
    this.projectDetails = this.fb.group({
      projectName: [this.project.name],
      projectDescription: [this.project.description],
      projectOwner: [initProjOwner]
    });
  }

  ngAfterViewInit(): void {
    this.projectName.nativeElement.addEventListener('focusout', () => {
      console.log('focusout');
      if (this.project.name !== this.projectDetails.get('projectName').value) {
        // Update
        this.project.name = this.projectDetails.get('projectName').value;
        this.updateProject();
      }
    });
    this.projectDescription.nativeElement.addEventListener('focusout', () => {
      if (this.project.description !== this.projectDetails.get('projectDescription').value) {
        // Update
        this.project.description = this.projectDetails.get('projectDescription').value;
        this.updateProject();
      }
    });
  }

  updateProject(skipOwnerCheck?: boolean) {
    skipOwnerCheck = skipOwnerCheck === null ? false : skipOwnerCheck;

    if (this.userSvc.profileInfo.getValue()._id !== this.project.owner && !skipOwnerCheck) {
      delete this.project.owner;
    }
    this.projectSvc.updateProject(this.project).subscribe(x => {
      this.project = x;
    })
  }

  updateProjectOwner(event: MatAutocompleteSelectedEvent) {
    let newOwner: TeamMember = JSON.parse(event.option.value);
    this.project.owner = newOwner.uid;
    this.projectDetails.get('projectOwner').setValue(newOwner.displayName);
    this.blur('projectOwner');
    this.updateProject(true);
  }

  // team member related methods

  getFilteredUserList() {
    if (!this.addMemberCtrl.value) {
      return;
    }
    this.allMembers = [];
    let currentProjMemIds = [];
    this.project.members.forEach(m => {
      currentProjMemIds.push(m.uid);
    })
    this.userSvc.getUsers(this.addMemberCtrl.value).subscribe((x: any[]) => {
      x.forEach(m => {
        if (!currentProjMemIds.includes(m._id)) {
          this.allMembers.push(m);
        }
      })
    })
  }

  newMemSelected(event: MatAutocompleteSelectedEvent) {
    let selected = JSON.parse(event.option.value)
    let newMem: TeamMember = {
      displayName: selected.displayName,
      uid: selected._id,
      username: selected.username
    }
    this.project.members.push(newMem);
    this.updateProject();
    this.memberInput.nativeElement.value = '';
    this.addMemberCtrl.setValue(null);
    this.allMembers = [];
  }

  removeTeamMember(member: TeamMember) {
    if (this.userSvc.profileInfo.getValue()._id === member.uid) {
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        data: {
          title: 'Remove yourself?',
          message: 'You will no longer be able to view this project. You will be navigated back to the My Project screen. Do you wish to continue?'
        }
      })

      dialogRef.afterClosed().subscribe(x => {
        if (!x) {
          return;
        } else {
          this.project.members.splice(this.project.members.indexOf(member), 1);
          this.updateProject();
          this.router.navigate(['/my-projects']);
        }
      })
    } else if (member.uid !== this.project.owner) {
      this.project.members.splice(this.project.members.indexOf(member), 1);
      this.updateProject();
    }
  }

  // CRUD for risks

  editRisk(risk) {
    const dialogRef = this.dialog.open(EditRiskModalComponent, {
      data: risk
    })
  }

  deleteRisk(risk) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Delete risk',
        message: 'Are you sure?'
      }
    })

    dialogRef.afterClosed().subscribe(x => {
    })
  }

  addRisk() {
    const dialogRef = this.dialog.open(AddRiskModalComponent);
    dialogRef.afterClosed().subscribe(x => {
      console.log(x);
    })

  }

  // CRUD for requirements

  editRequirement(req) {
    const dialogRef = this.dialog.open(EditRequirementModalComponent, {
      data: req
    })
    dialogRef.afterClosed().subscribe(x => {
    })
  }

  deleteRequirement(req) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Delete risk',
        message: 'Are you sure?'
      }
    })

    dialogRef.afterClosed().subscribe(x => {
    })
  }

  addRequirement() {
    const dialogRef = this.dialog.open(AddRequirementModalComponent);
    dialogRef.afterClosed().subscribe(x => {
    })
  }

  // Utility

  stringify(s) {
    return JSON.stringify(s);
  }

  preventKeydown(event: KeyboardEvent) {
    event.preventDefault();
  }

  blur(element: string) {
    this[element].nativeElement.blur();
  }

}

@Component({
  selector: 'add-risk-modal',
  templateUrl: 'add-risk-modal.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class AddRiskModalComponent {

  addRiskForm = this.fb.group({
    description: ['', Validators.required],
    status: ['', Validators.required]
  })

  constructor(private fb: FormBuilder) { }

}

@Component({
  selector: 'edit-risk-modal',
  templateUrl: 'edit-risk-modal.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class EditRiskModalComponent {

  editRiskForm = this.fb.group({
    description: [this.data.riskDescription, Validators.required],
    status: [this.data.riskStatus, Validators.required]
  })

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) { }

}

@Component({
  selector: 'confirm-modal',
  templateUrl: 'confirm-modal.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ConfirmModalComponent {

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) { }

}

@Component({
  selector: 'add-requirement-modal',
  templateUrl: 'add-requirement-modal.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class AddRequirementModalComponent {

  reqTypes: any[] = ['Functional', 'Non-Functional'];

  addRequirementForm = this.fb.group({
    description: ['', Validators.required],
    type: ['', Validators.required],
    status: ['', Validators.required]
  })

  reqStatuses = RequirementStatusEnum;

  constructor(private fb: FormBuilder) { }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

}

@Component({
  selector: 'edit-requirement-modal',
  templateUrl: 'edit-requirement-modal.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class EditRequirementModalComponent {

  reqTypes: any[] = ['Functional', 'Non-Functional'];

  editRequirementForm = this.fb.group({
    description: [this.data.reqDescription, Validators.required],
    type: [this.data.reqType, Validators.required],
    status: [this.data.reqStatus, Validators.required]
  })

  reqStatuses = RequirementStatusEnum;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) { }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

}
