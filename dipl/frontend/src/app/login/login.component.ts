import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "../app.component";

@Component({
  selector: "login-comp",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule], //чтобы работало *ngIf
})
export class LoginComponent {
  public password = "";
  public login = "";
  public buttonState = "unclicked";
  appComponentClass: AppComponent;

  constructor(_appComponentClass: AppComponent) {
    this.appComponentClass = _appComponentClass;
  }

  public buttonClkVhod(): void {
    this.appComponentClass.formChange.next("vhod");
  }
  public buttonClkRegistration(): void {
    this.appComponentClass.formChange.next("registration");
    // тут пишем логику на typescript
  }
}
