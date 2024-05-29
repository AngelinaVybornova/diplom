import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "../app.component";
import { User } from "../models/models";
import { Observable, lastValueFrom } from "rxjs";
import { HttpClient, HttpClientModule } from "@angular/common/http";

@Component({
  selector: "login-comp",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], //чтобы работало *ngIf
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

  constructor(_appComponentClass: AppComponent, private http: HttpClient) {
    this.appComponentClass = _appComponentClass;
  }

  @Output() public userSet = new EventEmitter<User>();

  public async buttonClkVhod(): Promise<void> {
    let usr = new User();
    usr.login = this.loginObj.name;
    usr.password = this.loginObj.password;
    let isExist = await this.logIn(usr);
    console.log("login", isExist);
    //console.log("1");
    this.userSet.emit(usr);
    //console.log("user sent1", usr, this.loginObj);
    this.appComponentClass.formChange.next("vhod");
  }
  public buttonClkRegistration(): void {
    let usr = new User();
    usr.login = this.signUpObj.name;
    usr.password = this.signUpObj.password;
    var isRegistered = this.signUp(usr);
    //console.log("2");
    this.userSet.emit(usr);
    //console.log("user sent2", usr, this.signUpObj);
    this.appComponentClass.formChange.next("registration");
    // тут пишем логику на typescript
  }

  public async logIn(data: User): Promise<boolean> {
    return await lastValueFrom(this.http.post(`http://localhost:4201/evoSim/login`, data)) as Promise<boolean>;
  }

  public async signUp(data: User): Promise<boolean> {
    return await lastValueFrom(this.http.post(`http://localhost:4201/evoSim/signUp`, data)) as Promise<boolean>;
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
