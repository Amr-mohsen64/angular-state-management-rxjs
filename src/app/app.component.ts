import { AuthStoreService } from "./services/auth-store.service";
import { Component, OnInit } from "@angular/core";
import { LoadingService } from "./loading/loading.service";
import { MessagesService } from "./messages/messages.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [],
})
export class AppComponent implements OnInit {
  constructor(public authStoreService: AuthStoreService) {}

  ngOnInit() {}

  logout() {
    this.authStoreService.logout();
  }
}
