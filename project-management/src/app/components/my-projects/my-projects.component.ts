import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/entities/project';
import { ProjectService } from 'src/app/services/project-service.service';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit {
  testProject: Project;

  constructor(private http: HttpClient, public projectSvc: ProjectService) {
    this.fetchTestProject();
  }

  ngOnInit(): void {
  }

  fetchTestProject() {
    this.http.get('https://sudonimus.com/projects?id=6067f8690656c50a42127afa').subscribe((x: Project) => {
      this.testProject = x[0];
    })
  }

}
