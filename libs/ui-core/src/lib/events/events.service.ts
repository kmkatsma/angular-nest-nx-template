import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

@Injectable()
export class EventsService {
  listeners: {};
  eventsSubject: Subject<any>;
  event$: Observable<any>;

  constructor() {
    this.listeners = {};
    this.eventsSubject = new Subject();
    this.event$ = this.eventsSubject.asObservable();

    this.event$.subscribe(
      ({ name, args }) => {
        if (this.listeners[name]) {
          for (let listener of this.listeners[name]) {
            listener(...args);
          }
        }
      });
  }

  on(name, listener) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }
    this.listeners[name].push(listener);
  }

  broadcast(name, ...args) {
    this.eventsSubject.next({
      name,
      args
    });
  }
}
