import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  constructor() {}

  courses$: Observable<Course[]>;

  filterByCategory(category: string) {
    this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
