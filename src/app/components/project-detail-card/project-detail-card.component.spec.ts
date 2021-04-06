import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailCardComponent } from './project-detail-card.component';

describe('ProjectDetailCardComponent', () => {
  let component: ProjectDetailCardComponent;
  let fixture: ComponentFixture<ProjectDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
