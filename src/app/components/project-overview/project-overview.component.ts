import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { KeyValue } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, shareReplay } from 'rxjs/operators';
import { Project } from 'src/app/entities/project';
import { Requirement } from 'src/app/entities/requirement';
import { RequirementPhase } from 'src/app/entities/requirement-phase.enum';
import { RequirementType } from 'src/app/entities/requirement-type.enum';
import { Risk } from 'src/app/entities/risk';
import { RiskStatus } from 'src/app/entities/risk-status.enum';
import { TeamMember } from 'src/app/entities/team-member';
import { ProjectService } from 'src/app/services/project-service.service';
import { UserService } from 'src/app/services/user-service.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ProjectOwnerPipe } from 'src/app/utility/project-owner.pipe';

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

  isHandset$: Observable<boolean> = this.bpo.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    )

  allMembers: any[] = [];
  projectDetails: FormGroup;
  addMemberCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  project: Project = <Project>{};
  risksColumns: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  requirementColumns: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  riskDataSource = new MatTableDataSource<Risk>();
  reqDataSource = new MatTableDataSource<Requirement>();

  constructor(public dialog: MatDialog, public http: HttpClient, private projectSvc: ProjectService, public userSvc: UserService, private fb: FormBuilder, private router: Router,
    private snackBar: MatSnackBar, private bpo: BreakpointObserver) { }

  ngOnInit(): void {
    this.project = this.projectSvc.projectOverviewPlaceholder;
    this.projectSvc.projectOverviewPlaceholder = null;

    this.addMemberCtrl.valueChanges.pipe(debounceTime(500)).subscribe(x => {
      this.getFilteredUserList();
    });
    this.setProject();

    this.isHandset$.subscribe(x => {
      if (x) {
        this.risksColumns.next(['riskId']);
        this.requirementColumns.next(['reqId']);
      } else {
        this.risksColumns.next(['riskId', 'riskDescription', 'riskStatus', 'editRisk', 'deleteRisk']);
        this.requirementColumns.next(['reqId', 'reqDescription', 'reqType', 'reqStatus', 'trackTime', 'editReq', 'deleteReq']);
      }
    })
  }

  ngAfterViewInit(): void {
    this.projectName.nativeElement.addEventListener('focusout', () => {
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

  setProject() {
    this.projectDetails = this.fb.group({
      projectName: [this.project.name],
      projectDescription: [this.project.description],
      projectOwner: [this.findProjectOwner()]
    });
    this.riskDataSource.data = this.project.risks;
    this.reqDataSource.data = this.project.requirements;
  }

  findProjectOwner(): string {
    let projOwner = '';
    this.project.members.forEach(mem => {
      if (mem.uid === this.project.owner) {
        projOwner = mem.displayName;
      }
    });
    return projOwner;
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
    }, err => {
      this.handleUpdateProjectError(err);
    });
  }

  handleUpdateProjectError(err) {
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
    this.projectSvc.getProjectById(this.project._id).subscribe(x => {
      this.project = x[0];
      this.setProject();
    }, () => {
      this.unknownError();
    })
  }

  unknownError() {
    this.snackBar.open('Unknown error occurred. Please try again.', null, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['red-snackbar']
    });
    this.router.navigate(['/my-projects']);
  }

  updateProjectOwner(event: MatAutocompleteSelectedEvent) {
    this.blur('projectOwner');
    let newOwner: TeamMember = JSON.parse(event.option.value);
    this.projectDetails.get('projectOwner').setValue(newOwner.displayName);

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Change Project Manager',
        message: `Are you sure you want to change the project manager to ${newOwner.displayName}?`
      }
    });

    dialogRef.afterClosed().subscribe(x => {
      if (x) {
        this.project.owner = newOwner.uid;
        this.updateProject(true);
      } else {
        this.projectDetails.get('projectOwner').setValue(this.findProjectOwner());
      }
    });
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

  showRisk(risk) {
    if (!this.isHandset()) {
      return;
    }
    const dialogRef = this.dialog.open(MobileRiskViewModalComponent, {
      data: risk
    });

    dialogRef.componentInstance.onDelete.subscribe(d => {
      this.deleteRisk(d, dialogRef);
    });

    dialogRef.componentInstance.onEdit.subscribe(d => {
      this.doEditRisk(d);
      dialogRef.close();
    });
  }

  showRequirement(req) {
    if (!this.isHandset()) {
      return;
    }
    const dialogRef = this.dialog.open(MobileRequirementViewModalComponent, {
      data: req
    });

    dialogRef.componentInstance.onDelete.subscribe(d => {
      this.deleteRequirement(d, dialogRef);
    });

    dialogRef.componentInstance.onEdit.subscribe(d => {
      this.doEditRequirement(d);
      dialogRef.close();
    });

    dialogRef.componentInstance.onTimeTrack.subscribe(d => {
      this.trackTime(d);
    })
  }

  // CRUD for risks

  editRisk(risk) {
    const dialogRef = this.dialog.open(EditRiskModalComponent, {
      data: risk
    })
    dialogRef.afterClosed().subscribe(x => {
      if (x) {
        this.doEditRisk(x);
      }
    });
  }

  doEditRisk(risk) {
    this.project.risks.forEach((r: Risk, i) => {
      if (r.riskId === risk.riskId) {
        this.project.risks[i] = risk;
      }
    });
    this.updateProject();
  }

  deleteRisk(risk, otherDialog?: MatDialogRef<any, any>) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Delete Risk',
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
        if (otherDialog) {
          otherDialog.close();
        }
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
    });
  }

  // CRUD for requirements

  editRequirement(req) {
    const dialogRef = this.dialog.open(EditRequirementModalComponent, {
      data: req
    })
    dialogRef.afterClosed().subscribe(x => {
      if (x) {
        this.doEditRequirement(x);
      }
    })
  }

  doEditRequirement(req) {
    this.project.requirements.forEach((r: Requirement, i) => {
      if (r.reqId === req.reqId) {
        this.project.requirements[i] = req;
      }
    });
    this.updateProject();
  }

  deleteRequirement(req, otherDialog?: MatDialogRef<any, any>) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Delete Requirement',
        message: 'Are you sure?'
      }
    })

    dialogRef.afterClosed().subscribe(x => {
      if (x) {
        this.project.requirements.forEach((r: Requirement, i) => {
          if (r.reqId === req.reqId) {
            this.project.requirements.splice(i, 1);
          }
        });
        this.updateProject();
        if (otherDialog) {
          otherDialog.close();
        }
      }
    });
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

  trackTime(requirement) {
    const dialogRef = this.dialog.open(TimeTrackerModalComponent, {
      data: {
        requirement: requirement
      },
      maxWidth: '90vw !important'
    });

    dialogRef.afterClosed().subscribe(x => {
      if (x) {
        let changes = false;
        x.requirement.phases.forEach((p, i) => {
          if (x.addedHours[p.phase]) {
            changes = true;
            x.requirement.phases[i].expendedHours += x.addedHours[p.phase];
          }
        });
        if (changes) {
          this.project.requirements.forEach((r: Requirement, i) => {
            if (r.reqId === x.requirement.reqId) {
              this.project.requirements[i] = x.requirement;
            }
          });
          this.updateProject();
        }
      }
    });

  }

  // Utility

  isHandset() {
    return this.bpo.isMatched(Breakpoints.Handset);
  }

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
  selector: 'add-requirement-modal',
  templateUrl: 'add-requirement-modal.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class AddRequirementModalComponent {

  addRequirementForm = this.fb.group({
    description: ['', Validators.required],
    type: ['', Validators.required],
    currentPhase: ['', Validators.required],
    dueAt: [0]
  })

  reqTypes = RequirementType;
  reqPhases = RequirementPhase;

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

  editRequirementForm = this.fb.group({
    reqId: [this.data.reqId],
    description: [this.data.description, Validators.required],
    type: [this.data.type, Validators.required],
    currentPhase: [this.data.currentPhase, Validators.required],
    dueAt: [0]
  })

  reqTypes = RequirementType;
  reqPhases = RequirementPhase;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) { }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

}

@Component({
  selector: 'time-tracker-modal',
  templateUrl: 'time-tracker-modal.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class TimeTrackerModalComponent {


  phasesColumns = ['phase', 'expendedHours', 'editHours'];
  datasource = new MatTableDataSource<any>();
  editValueHolder = {};

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.datasource.data = this.data.requirement.phases;

  }

  updateExpendedHours(phase) {
    this.datasource.data = this.data.requirement.phases;
  }

  close() {
    return {
      requirement: this.data.requirement,
      addedHours: this.editValueHolder
    }
  }

}

@Component({
  selector: 'mobile-risk-view-modal',
  templateUrl: 'mobile-risk-view-modal.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class MobileRiskViewModalComponent {

  title: string = 'View Risk'
  editMode: boolean = false;

  editRiskForm = this.fb.group({
    riskId: [this.data.riskId],
    description: [this.data.description, Validators.required],
    status: [this.data.status, Validators.required]
  })

  onEdit: EventEmitter<any> = new EventEmitter();
  onDelete: EventEmitter<any> = new EventEmitter();

  statuses = RiskStatus;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) { }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  resetForm() {
    this.editRiskForm.reset({ riskId: this.data.riskId, description: this.data.description, status: this.data.status });
  }
}

@Component({
  selector: 'mobile-requirement-view-modal',
  templateUrl: 'mobile-requirement-view-modal.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class MobileRequirementViewModalComponent {

  title: string = 'View Requirement'
  editMode: boolean = false;

  editRequirementForm = this.fb.group({
    reqId: [this.data.reqId],
    description: [this.data.description, Validators.required],
    type: [this.data.type, Validators.required],
    currentPhase: [this.data.currentPhase, Validators.required],
    dueAt: [this.data.dueAt]
  })

  onTimeTrack: EventEmitter<any> = new EventEmitter();
  onEdit: EventEmitter<any> = new EventEmitter();
  onDelete: EventEmitter<any> = new EventEmitter();

  reqTypes = RequirementType;
  reqPhases = RequirementPhase;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) { }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  resetForm() {
    this.editRequirementForm.reset({ reqId: this.data.reqId, description: this.data.description, type: this.data.type, currentPhase: this.data.currentPhase, dueAt: this.data.dueAt });
  }

}
