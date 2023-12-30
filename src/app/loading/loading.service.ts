import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { finalize, switchMap, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {
  constructor() {
    console.log("loading servuice had been created");
  }
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  showLoadingUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn()),
      switchMap(() => obs$),
      finalize(() => this.loadingOff())
    );
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
