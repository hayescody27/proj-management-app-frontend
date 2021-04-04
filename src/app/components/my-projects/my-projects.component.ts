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

  projects: Project[] = [];
  selectedProject: Project;

  constructor(private http: HttpClient, public projectSvc: ProjectService) {

  }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.projectSvc.getProjects().subscribe((x: Project[]) => {
      this.projects = x;
    })
  }

  createTestProject() {
    this.projectSvc.createProject({ 'name': 'Example Project', 'description': 'Example description.' }).subscribe(x => {
      this.getProjects();
    });
  }

}
