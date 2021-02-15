import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MyProjectsComponent } from './components/my-projects/my-projects.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { ProjectOverviewComponent } from './components/project-overview/project-overview.component';
import { ProjectTrackingComponent } from './components/project-tracking/project-tracking.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'my-projects', component: MyProjectsComponent },
  { path: 'new-project', component: NewProjectComponent },
  { path: 'project-tracking', component: ProjectTrackingComponent },
  { path: 'project-overview', component: ProjectOverviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
