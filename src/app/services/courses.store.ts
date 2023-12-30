import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { LoadingService } from "./../loading/loading.service";
import { MessagesService } from "./../messages/messages.service";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  constructor(
    private http: HttpClient,
    private messagesService: MessagesService,
    private loadingService: LoadingService
  ) {
    this.loadAllCourses();
  }

  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();

  private loadAllCourses() {
    const loadedCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      catchError((error) => {
        const message = "could not load course";
        this.messagesService.showErrors(message);
        return throwError(error);
      }),
      tap((courses) => this.coursesSubject.next(courses)),
      shareReplay()
    );

    this.loadingService.showLoadingUntilCompleted(loadedCourses$).subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.coursesSubject.getValue();
    const courseIndex = courses.findIndex((course) => course.id === courseId);

    const newCourse = {
      ...courses[courseIndex],
      ...changes,
    };

    const newCourses = [...courses];
    newCourses[courseIndex] = newCourse;
    this.coursesSubject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      shareReplay(),
      catchError((error) => {
        const message = "could not lave course";
        this.messagesService.showErrors(message);
        return throwError(error);
      })
    );
  }

  filterByCategory(category: string) {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
