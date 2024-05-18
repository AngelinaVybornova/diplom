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

  appComponentClass = new AppComponent();

  public buttonClkVhod(): void {
    this.appComponentClass.formChange.next("vhod");
    if (this.buttonState === "unclicked") {
      this.buttonState = "clicked";
      console.log("click", this.buttonState); //так выводим логи для дебага, смотри их в консоли браузера
    } else {
      this.buttonState = "unclicked";
      console.log("unclick", this.buttonState);
    }
  }
  public buttonClkRegistration(): void {
    this.appComponentClass.formChange.next("registration");
    if (this.buttonState === "unclicked") {
      this.buttonState = "clicked";
      console.log("click", this.buttonState); //так выводим логи для дебага, смотри их в консоли браузера
    } else {
      this.buttonState = "unclicked";
      console.log("unclick", this.buttonState);
    }
    // тут пишем логику на typescript
  }
}
