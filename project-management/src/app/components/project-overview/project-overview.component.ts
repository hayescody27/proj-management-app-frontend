import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { RequirementStatus } from 'src/app/entities/requirement-status';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  allMembers: any[] = ['New Member 1', 'New Member 2'];
  addMemberCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];

  project = {
    members: ['Cody', 'Jhane', 'James', 'Yoan', 'Roger'],
    risks: [
      { riskDescription: 'This is an example risk', riskStatus: 1 },
      { riskDescription: 'This is an example risk', riskStatus: 2 },
      { riskDescription: 'This is an example risk', riskStatus: 3 },
      { riskDescription: 'This is an example risk', riskStatus: 4 },
      /*       { riskDescription: 'This is an example risk', riskStatus: 1 },
            { riskDescription: 'This is an example risk', riskStatus: 2 },
            { riskDescription: 'This is an example risk', riskStatus: 3 },
            { riskDescription: 'This is an example risk', riskStatus: 4 },
            { riskDescription: 'This is an example risk', riskStatus: 1 },
            { riskDescription: 'This is an example risk', riskStatus: 2 },
            { riskDescription: 'This is an example risk', riskStatus: 3 },
            { riskDescription: 'This is an example risk', riskStatus: 4 },
            { riskDescription: 'This is an example risk', riskStatus: 1 },
            { riskDescription: 'This is an example risk', riskStatus: 2 },
            { riskDescription: 'This is an example risk', riskStatus: 3 },
            { riskDescription: 'This is an example risk', riskStatus: 4 },
            { riskDescription: 'This is an example risk', riskStatus: 1 },
            { riskDescription: 'This is an example risk', riskStatus: 2 },
            { riskDescription: 'This is an example risk', riskStatus: 3 },
            { riskDescription: 'This is an example risk', riskStatus: 4 },
            { riskDescription: 'This is an example risk', riskStatus: 1 },
            { riskDescription: 'This is an example risk', riskStatus: 2 },
            { riskDescription: 'This is an example risk', riskStatus: 3 },
            { riskDescription: 'This is an example risk', riskStatus: 4 }, */
    ],
    requirements: [
      { reqDescription: 'This will be used as an example for a really long project requirement. The project must be super useful and super cool. The layout must be nice. ', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Coding' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Requirements Analysis' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Designing' },
      { reqDescription: 'Requirement 1', reqType: 'Non-Functional', reqStatus: 'Testing' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'testing' },
      { reqDescription: 'Requirement 1', reqType: 'Non-Functional', reqStatus: 'Coding' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Coding' },
      { reqDescription: 'Requirement 1', reqType: 'Non-Functional', reqStatus: 'Coding' },
      { reqDescription: 'Requirement 1', reqType: 'Non-Functional', reqStatus: 'Coding' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Designing' },
      { reqDescription: 'Requirement 1', reqType: 'Non-Functional', reqStatus: 'Designing' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Testing' },
      { reqDescription: 'Requirement 1', reqType: 'Non-Functional', reqStatus: 'Testing' },
    ]
  }

  risksColumns = ['riskDescription', 'riskStatus', 'editRisk', 'deleteRisk'];
  requirementColumns = ['reqDescription', 'reqType', 'reqStatus', 'editReq', 'deleteReq'];

  constructor(public dialog: MatDialog, public http: HttpClient) { }

  ngOnInit(): void {
  }

  addTeamMember(event) {
  }

  removeTeamMember(member) {
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

  reqStatuses = RequirementStatus;

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

  reqStatuses = RequirementStatus;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) { }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

}
