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
  isSignDivVisiable: boolean = true;

  signUpObj: SignUpModel = new SignUpModel();
  loginObj: LoginModel = new LoginModel();

  public password = "";
  public login = "";
  public buttonState = "unclicked";
  appComponentClass: AppComponent;
  router: any;

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

  onRegister() {
    /*
    debugger;
    const localUser = localStorage.getItem("angular17users");
    if (localUser != null) {
      const users = JSON.parse(localUser);
      users.push(this.signUpObj);
      localStorage.setItem("angular17users", JSON.stringify(users));
    } else {
      const users = [];
      users.push(this.signUpObj);
      localStorage.setItem("angular17users", JSON.stringify(users));
    }
    alert("Registration Success");
    */
  }

  onLogin() {
    /*debugger;
    const localUsers = localStorage.getItem("angular17users");
    if (localUsers != null) {
      const users = JSON.parse(localUsers);

      const isUserPresent = users.find(
        (user: SignUpModel) =>
          user.email == this.loginObj.email &&
          user.password == this.loginObj.password
      );
      if (isUserPresent != undefined) {
        alert("User Found...");
        localStorage.setItem("loggedUser", JSON.stringify(isUserPresent));
        this.router.navigateByUrl("/dashboard");
      } else {
        alert("No User Found");
      }
    }
    */
  }
}

export class SignUpModel {
  name: string;
  password: string;

  constructor() {
    this.name = "";
    this.password = "";
  }
}

export class LoginModel {
  name: string;
  password: string;

  constructor() {
    this.name = "";
    this.password = "";
  }
}
