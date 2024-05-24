import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
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
  public bM: number;
  public bN: number;
  public foodProbability: number = 0;
  public maxOrgNum: number = 0;

  appComponentClass: AppComponent;

  constructor(_appComponentClass: AppComponent) {
    this.appComponentClass = _appComponentClass;
  }

  @Output() onChanged = new EventEmitter<{ bM: number; bN: number }>();
  public buttonClkStartSimulation(bM: number, bN: number): void {
    this.onChanged.emit({ bM, bN });
    console.log("fdfdfdfd", this.bM, this.bN);
    this.appComponentClass.formChange.next("startSim");
  }
  public buttonClkVihod(): void {
    this.appComponentClass.formChange.next("vihod");
  }
  //public autoPopulation(): void {
  //mm
  //}
  // тут пишем логику на typescript

  foodInputChange(event: any) {
    this.foodProbability = event.target.value;
  }
  maxOrgInputChange(event: any) {
    this.maxOrgNum = event.target.value;
  }
}
