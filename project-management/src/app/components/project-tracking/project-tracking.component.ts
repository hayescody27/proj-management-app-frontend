import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-tracking',
  templateUrl: './project-tracking.component.html',
  styleUrls: ['./project-tracking.component.scss']
})
export class ProjectTrackingComponent implements OnInit {

  projectSelectForm: FormGroup;
  detailSelect: FormControl = new FormControl(false);

  projects: any[] = [
    {
      id: 'P-123456',
      requirements: [
        {
          id: 'R-123456',
          phases: [
            {
              phase: 'Requirements Analysis',
              time: 50
            },
            {
              phase: 'Designing',
              time: 5
            },
            {
              phase: 'Coding',
              time: 100
            },
            {
              phase: 'Testing',
              time: 20
            },
            {
              phase: 'Project Management',
              time: 200
            }
          ]
        }
      ]
    }
  ];

  selectedProject: any = {}

  pieData: any[] = [];
  view: any[] = [1700, 600];

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

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.projectSelectForm = this.fb.group({
      project: ['', Validators.required],
      requirement: ['', Validators.required]
    });

    this.projectSelectForm.controls['project'].valueChanges.subscribe(p => {
      this.selectedProject = JSON.parse(p);
    });
    this.projectSelectForm.controls['requirement'].valueChanges.subscribe(r => {
      this.pieData = this.transform(JSON.parse(r).phases);
    });
    this.detailSelect.valueChanges.subscribe(d => {
      console.log(d);
    })
  }

  changeSelection() {

  }

  stringify(o) {
    return JSON.stringify(o);
  }

  transform(data: any[]) {
    let transformed = [];
    data.forEach(d => {
      transformed.push({
        name: d.phase,
        value: d.time
      })
    })
    return transformed;
  }

}
