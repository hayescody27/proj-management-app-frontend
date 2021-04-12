import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from 'src/app/entities/project';

@Component({
  selector: 'project-detail-card',
  templateUrl: './project-detail-card.component.html',
  styleUrls: ['./project-detail-card.component.scss']
})
export class ProjectDetailCardComponent implements OnInit {

  @Input()
  project: Project;

  @Output()
  onView: EventEmitter<Project> = new EventEmitter<Project>();

  @Output()
  onMonitor: EventEmitter<Project> = new EventEmitter<Project>();

  @Output()
  onDelete: EventEmitter<Project> = new EventEmitter<Project>();

  constructor() { }

  ngOnInit(): void {
  }

  view() {
    this.onView.emit(this.project);
  }

  monitor() {
    this.onMonitor.emit(this.project);
  }

  delete() {
    this.onDelete.emit(this.project);
  }

}
