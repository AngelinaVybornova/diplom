import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "../app.component";

@Component({
  selector: "basicSetup-comp",
  templateUrl: "./basicSetup.component.html",
  styleUrls: ["./basicSetup.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule], //чтобы работало *ngIf
})
export class BasicSetupComponent {
  public buttonState = "unclicked";
  public M = "";
  public N = "";
  public foodProbability: number = 0;
  public maxOrgNum: number = 0;

  appComponentClass: AppComponent;

  constructor(_appComponentClass: AppComponent) {
    this.appComponentClass = _appComponentClass;
  }

  public buttonClkStartSimulation(): void {
    this.appComponentClass.formChange.next("startSim");
  }
  //public autoPopulation(): void {
  //mm
  //}
  // тут пишем логику на typescript
}
