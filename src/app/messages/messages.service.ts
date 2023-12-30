import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService {
  private errorsSubject = new BehaviorSubject<string[]>([]);
  errors$ = this.errorsSubject
    .asObservable()
    .pipe(filter((messages) => messages && messages.length > 0));

  constructor() {}

  showErrors(...errors: string[]) {
    this.errorsSubject.next(errors);
  }
}
