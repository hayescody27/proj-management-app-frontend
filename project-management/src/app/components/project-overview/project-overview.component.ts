import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
      { riskDescription: 'This is an example risk', riskStatus: 4 },
      { riskDescription: 'This is an example risk', riskStatus: 1 },
      { riskDescription: 'This is an example risk', riskStatus: 2 },
      { riskDescription: 'This is an example risk', riskStatus: 3 },
      { riskDescription: 'This is an example risk', riskStatus: 4 },
    ],
    requirements: [
      { reqDescription: 'This will be used as an example for a really long project requirement. The project must be super useful and super cool. The layout must be nice. ', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
      { reqDescription: 'Requirement 1', reqType: 'Functional', reqStatus: 'Development' },
    ]
  }

  risksColumns = ['riskDescription', 'riskStatus', 'editRisk',];
  requirementColumns = ['reqDescription', 'reqType', 'reqStatus', 'editReq'];

  constructor() { }

  ngOnInit(): void {
  }

  addTeamMember(event) {
    console.log(event);
  }

  removeTeamMember(member) {
    console.log(member);
  }

  editRisk(risk) {
    console.log(risk);
  }

  addRisk() {

  }

  editRequirement(req) {
    console.log(req);
  }

  addRequirement() {

  }

}
