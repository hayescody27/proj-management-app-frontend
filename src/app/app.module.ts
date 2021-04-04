import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MyProjectsComponent } from './components/my-projects/my-projects.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { ProfileSetupComponent } from './components/profile-setup/profile-setup.component';
import { ProgressOverlayComponent } from './components/progress-overlay/progress-overlay.component';
import { AddRequirementModalComponent, AddRiskModalComponent, ConfirmModalComponent, EditRequirementModalComponent, EditRiskModalComponent, ProjectOverviewComponent, TimeTrackerModalComponent } from './components/project-overview/project-overview.component';
import { ProjectTrackingComponent } from './components/project-tracking/project-tracking.component';
import { BearerTokenInterceptor } from './services/bearer-token-interceptor.interceptor';
import { ProgressService } from './services/progress-service.service';
import { ProjectOwnerPipe } from './utility/project-owner.pipe';
import { RiskStatusPipe } from './utility/risk-status.pipe';


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
    TimeTrackerModalComponent,
    PageTitleComponent,
    ProgressOverlayComponent,
    ProfileSetupComponent,
    ProjectOwnerPipe,
    RiskStatusPipe,

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
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    NgxChartsModule,
  ],
  providers: [
    ProgressService,
    /* { provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true } */
    { provide: HTTP_INTERCEPTORS, useClass: BearerTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
