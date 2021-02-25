import { Component, OnInit } from '@angular/core';
import { ProgressService } from 'src/app/services/progress-service.service';

@Component({
  selector: 'progress-overlay',
  templateUrl: './progress-overlay.component.html',
  styleUrls: ['./progress-overlay.component.scss']
})
export class ProgressOverlayComponent implements OnInit {

  public loading: boolean;

  constructor(private ps: ProgressService) {
    this.ps.isLoading.subscribe(b => {
      this.loading = b;
    })
  }

  ngOnInit(): void {
  }

}
