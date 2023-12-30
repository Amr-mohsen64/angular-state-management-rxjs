import { Component, OnInit } from "@angular/core";
import { EMPTY, Observable, throwError } from "rxjs";
import { catchError, finalize, map, tap } from "rxjs/operators";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { CoursesService } from "./../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CoursesStore } from "../services/courses.store";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private coursesStore: CoursesStore,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {}

  ngOnInit() {
    this.reloadCourse();
  }

  reloadCourse() {
    const courses$ = this.coursesService.loadAllCourse().pipe(
      map((courses) => courses.sort(sortCoursesBySeqNo)),
      catchError((error) => {
        const message = "could not load course";
        this.messagesService.showErrors(message);
        return throwError(error);
      })
    );

    const loadedCourses$ =
      this.loadingService.showLoadingUntilCompleted(courses$);

    this.beginnerCourses$ = loadedCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );

    this.advancedCourses$ = loadedCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );
  }
}
