import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, combineLatest } from "rxjs";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";
import { CoursesService } from "./../services/courses.service";
import { map, startWith } from "rxjs/operators";

interface CourseData {
  course: Course;
  lessons: Lesson[];
}
@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  data$: Observable<CourseData>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    const courseId = +this.route.snapshot.paramMap.get("courseId");
    const course$ = this.coursesService
      .loadCourseById(courseId)
      .pipe(startWith(null)); // to optimize initial loading to not show white screen

    const lessons$ = this.coursesService
      .loadAllCourseLessons(courseId)
      .pipe(startWith([]));

    this.data$ = combineLatest([course$, lessons$]).pipe(
      map(([course, lessons]) => ({ course, lessons }))
    );
  }
}
