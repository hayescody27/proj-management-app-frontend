import { X } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from '../entities/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl: string = 'https://sudonimus.com/projects'
  projectOverviewPlaceholder: Project = <Project>{};

  constructor(private router: Router, private http: HttpClient) { }

  createProject(project) {
    return this.http.post(`${this.baseUrl}`, project);
  }

  deleteProject(id) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  openProject(project: Project) {
    this.projectOverviewPlaceholder = project;
    this.router.navigate(['/project-overview']);
  }

  updateProject(project: Project): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${project._id}`, project);
  }

  getProjects() {
    return this.http.get(`${this.baseUrl}`);
  }

  getProjectById(id) {
    return this.http.get(`${this.baseUrl}?id=${id}`);
  }
}
