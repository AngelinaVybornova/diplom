import { Component, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ExampleComponent } from "./newComponentExample/example.component"; //указываем путь
import { LoginComponent } from "./login/login.component"; //указываем путь
import { BasicSetupComponent } from "./basicSetup/BasicSetup.component"; //указываем путь
import { SimulationFormComponent } from "./simulationForm/simulationForm.component"; //указываем путь
import { CommonModule } from "@angular/common";
import { Subject, takeUntil } from "rxjs";

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
    <login-comp *ngIf="formState === 'unclicked'">Кнопку нажали</login-comp>
    <login-comp *ngIf="formState === 'vihod'">Кнопку нажали</login-comp>
    <basicSetup-comp
      (onChanged)="onChanged($event)"
      *ngIf="formState === 'vhod'"
    ></basicSetup-comp>
    <basicSetup-comp
      (onChanged)="onChanged($event)"
      *ngIf="formState === 'registration'"
    ></basicSetup-comp>
    <simulationForm-comp
      *ngIf="formState === 'startSim'"
      [M]="aM"
      [N]="aN"
    ></simulationForm-comp>
    <basicSetup-comp
      (onChanged)="onChanged($event)"
      *ngIf="formState === 'stopSim'"
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

  onChanged(sizePole: IsizePole) {
    this.aM = sizePole.bM;
    console.log("ususu", sizePole, sizePole.bM, sizePole.bN);
    this.aN = sizePole.bN;
  }

  public ngOnInit(): void {
    this.formChange.pipe(takeUntil(this.unsubscribe)).subscribe((state) => {
      this.formState = state;
    });
  }

  public ngOnDestroy(): void {
    console.log("ююююююхухх");
    this.unsubscribe.next();
  }
}
interface IsizePole {
  bM: number;
  bN: number;
}
