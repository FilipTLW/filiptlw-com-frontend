import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private ezMode: Subject<boolean> = new Subject<boolean>();
  ezMode$: Observable<boolean> = this.ezMode.asObservable();

  constructor() { }

  getEzMode(): boolean {
    // TODO get from db if logged in
    const ezMode = localStorage.getItem('ezMode');
    if (ezMode) {
      return ezMode === 'true';
    } else {
      this.setEzMode(false)
      return false;
    }
  }

  setEzMode(ezMode: boolean) {
    // TODO set in db if logged in
    localStorage.setItem('ezMode', ezMode ? 'true' : 'false');
    this.ezMode.next(ezMode);
  }


}
