import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyProjectsComponent } from './components/my-projects/my-projects.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { ProjectTrackingComponent } from './components/project-tracking/project-tracking.component';
import { AddRequirementModalComponent, AddRiskModalComponent, ConfirmModalComponent, EditRequirementModalComponent, EditRiskModalComponent, ProjectOverviewComponent } from './components/project-overview/project-overview.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { ProgressOverlayComponent } from './components/progress-overlay/progress-overlay.component';
import { ProgressService } from './services/progress-service.service';
import { ProgressInterceptor } from './services/progress-interceptor.service';
import { BearerTokenInterceptor } from './services/bearer-token-interceptor.interceptor';
import { ProfileSetupComponent } from './components/profile-setup/profile-setup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MyProjectsComponent,
    NewProjectComponent,
    ProjectTrackingComponent,
    ProjectOverviewComponent,
    AddRiskModalComponent,
    EditRiskModalComponent,
    ConfirmModalComponent,
    AddRequirementModalComponent,
    EditRequirementModalComponent,
    PageTitleComponent,
    ProgressOverlayComponent,
    ProfileSetupComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    MatGridListModule,
    MatDividerModule,
    MatDatepickerModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [
    ProgressService,
    /* { provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true } */
    { provide: HTTP_INTERCEPTORS, useClass: BearerTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
