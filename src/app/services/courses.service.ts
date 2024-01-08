import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Course } from "../model/course";
import { map, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";
import { Lesson } from "../model/lesson";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  loadAllCourse(): Observable<Course[]> {
    return this.http.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      shareReplay(1)
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseId}`, changes)
      .pipe(shareReplay());
  }

  searchLessons(search: string): Observable<Lesson[]> {
    return this.http
      .get<Lesson[]>("/api/lessons", {
        params: {
          filter: search,
          pageSize: "100",
        },
      })
      .pipe(
        map((response) => response["payload"]),
        shareReplay()
      );
  }
}