import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterListenerService {

  private subject = new Subject<any>();

  constructor() { }

  setTarget(target: string) {
    this.subject.next({ target: target });
  }

  getTarget(): Observable<any> {
    return this.subject.asObservable();
  }

}
