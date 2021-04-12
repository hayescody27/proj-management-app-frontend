import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project-service.service';

@Component({
  selector: 'app-project-tracking',
  templateUrl: './project-tracking.component.html',
  styleUrls: ['./project-tracking.component.scss']
})
export class ProjectTrackingComponent implements OnInit {

  isHandset$: Observable<boolean> = this.bpo.observe(['(max-width: 850px)'])
    .pipe(
      map(result => result.matches),
      shareReplay()
    )

  @ViewChild('containerRef')
  containerRef: ElementRef<HTMLDivElement>;

  projectSelectForm: FormGroup;
  detailSelect: FormControl = new FormControl(false);

  selectedProject: any = {};
  selectedRequirement: any = {};

  pieData: any[] = [];
  pieView: any[] = [];
  detailedView: any[] = [1500, 450];

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  trimLabels: boolean = false;
  legendPosition: string = 'below';
  legendTitle: string = 'Phases';

  colorScheme = {
    domain: ['#e38800', '#00e3d4', '#323ca8', '#4ac754', '#673ab7']
  };

  constructor(private fb: FormBuilder, private projSvc: ProjectService, private bpo: BreakpointObserver, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      this.getProject(p['id']);
    })

    this.projectSelectForm = this.fb.group({
      requirement: ['', Validators.required]
    });

    this.projectSelectForm.controls['requirement'].valueChanges.subscribe(r => {
      this.pieData = this.transform(JSON.parse(r).phases);
      this.selectedRequirement = JSON.parse(r);
    });
  }

  ngAfterViewInit(): void {
    this.isHandset$.subscribe(x => {
      if (x) {
        this.pieView = [this.containerRef.nativeElement.offsetWidth, 300];
        this.legendPosition = 'beside';
        this.showLabels = false;
      } else {
        this.pieView = [1200, 600];
        this.legendPosition = 'below';
        this.showLabels = true
      }
    });

  }

  getProject(id) {
    this.projSvc.getProjectById(id).subscribe(p => {
      this.selectedProject = p[0];
    })
  }

  stringify(o) {
    return JSON.stringify(o);
  }

  transform(data: any[]) {
    let transformed = [];
    data.forEach(d => {
      transformed.push({
        name: d.phase,
        value: d.expendedHours
      })
    })
    return transformed;
  }

}
