import { Component, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ExampleComponent } from "./newComponentExample/example.component"; //указываем путь
import { LoginComponent } from "./login/login.component"; //указываем путь
import { BasicSetupComponent } from "./basicSetup/BasicSetup.component"; //указываем путь
import { SimulationFormComponent } from "./simulationForm/simulationForm.component"; //указываем путь
import { CommonModule } from "@angular/common";
import { Subject, takeUntil } from "rxjs";
import { CurrentState, User } from "./models/models";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [
    FormsModule,
    ExampleComponent,
    CommonModule,
    LoginComponent,
    BasicSetupComponent,
    SimulationFormComponent,
  ], //указываем тут
  template: `
    <login-comp 
    (userSet)="usrSet($event)"
    *ngIf="formState === 'unclicked'">Кнопку нажали</login-comp>
    <login-comp 
    (userSet)="usrSet($event)"
    *ngIf="formState === 'vihod'">Кнопку нажали</login-comp>
    <basicSetup-comp
      (onChanged)="onChanged($event)"
      (stateFormed)="setState($event)"
      *ngIf="formState === 'vhod'"
      [user]="user"
    ></basicSetup-comp>
    <basicSetup-comp
      (onChanged)="onChanged($event)"
      (stateFormed)="setState($event)"
      *ngIf="formState === 'registration'"
      [user]="user"
    ></basicSetup-comp>
    <simulationForm-comp
      *ngIf="formState === 'startSim'"
      [M]="aM"
      [N]="aN"
      [user]="user"
      [state]="state"
    ></simulationForm-comp>
    <basicSetup-comp
      (onChanged)="onChanged($event)"
      (stateFormed)="setState($event)"
      *ngIf="formState === 'stopSim'"
      [user]="user"
    ></basicSetup-comp>
  `,
})
export class AppComponent {
  name = "";
  public formState = "unclicked";
  public formChange = new Subject<string>();
  unsubscribe = new Subject<void>();
  aM = 300;
  aN = 700;
  user: User = new User();
  state: CurrentState = new CurrentState();

  onChanged(sizePole: IsizePole) {
    this.aM = sizePole.bM;
    //console.log("ususu", sizePole, sizePole.bM, sizePole.bN);
    this.aN = sizePole.bN;
  }

  usrSet(usr: User) {
    this.user = usr;
    //console.log("user", this.user);
  }

  setState(state: CurrentState) {
    this.state = state;
    //console.log("user", this.user);
  }

  public ngOnInit(): void {
    this.user.login = "test";
    this.user.password = "test";
    this.formChange.pipe(takeUntil(this.unsubscribe)).subscribe((state) => {
      this.formState = state;
      //console.log("state", this.formState);
    });
  }

  public ngOnDestroy(): void {
    //console.log("ююююююхухх");
    this.unsubscribe.next();
  }
}
interface IsizePole {
  bM: number;
  bN: number;
}
