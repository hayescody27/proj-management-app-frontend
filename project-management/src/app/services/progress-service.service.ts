import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }
}
