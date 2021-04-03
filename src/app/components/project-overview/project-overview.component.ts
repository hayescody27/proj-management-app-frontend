import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { KeyValue } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Project } from 'src/app/entities/project';
import { Requirement } from 'src/app/entities/requirement';
import { RequirementPhase } from 'src/app/entities/requirement-phase.enum';
import { RequirementType } from 'src/app/entities/requirement-type.enum';
import { Risk } from 'src/app/entities/risk';
import { RiskStatus } from 'src/app/entities/risk-status.enum';
import { TeamMember } from 'src/app/entities/team-member';
import { ProjectService } from 'src/app/services/project-service.service';
import { UserService } from 'src/app/services/user-service.service';

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
  riskDataSource = new MatTableDataSource<Risk>();
  reqDataSource = new MatTableDataSource<Requirement>();

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
    this.riskDataSource.data = this.project.risks;
    this.reqDataSource.data = this.project.requirements;
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
      this.riskDataSource.data = this.project.risks;
      this.reqDataSource.data = this.project.requirements;
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
    dialogRef.afterClosed().subscribe(x => {
      if (x) {
        this.project.risks.forEach((r: Risk, i) => {
          if (r.riskId === x.riskId) {
            this.project.risks[i] = x;
          }
        });
        this.updateProject();
      }
    });
  }

  deleteRisk(risk) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Delete risk',
        message: 'Are you sure?'
      }
    })

    dialogRef.afterClosed().subscribe(x => {
      if (x) {
        this.project.risks.forEach((r: Risk, i) => {
          if (r.riskId === risk.riskId) {
            this.project.risks.splice(i, 1);
          }
        });
        this.updateProject();
      }
    });
  }

  addRisk() {
    const dialogRef = this.dialog.open(AddRiskModalComponent);
    dialogRef.afterClosed().subscribe(x => {
      if (x) {
        this.project.risks.push(x);
        this.updateProject();
      }
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
      if (x) {
        this.project.requirements.push(x);
        this.updateProject();
      }
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

  statuses = RiskStatus;

  constructor(private fb: FormBuilder) { }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

}

@Component({
  selector: 'edit-risk-modal',
  templateUrl: 'edit-risk-modal.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class EditRiskModalComponent {

  editRiskForm = this.fb.group({
    riskId: [this.data.riskId],
    description: [this.data.description, Validators.required],
    status: [this.data.status, Validators.required]
  })

  statuses = RiskStatus;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) { }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

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

  addRequirementForm = this.fb.group({
    description: ['', Validators.required],
    type: ['', Validators.required],
    status: ['', Validators.required],
    dueAt: [0]
  })

  reqTypes = RequirementType;
  reqStatuses = RequirementPhase;

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

  reqStatuses = RequirementPhase;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) { }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

}
