import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "../app.component";

@Component({
  selector: "simulationForm-comp",
  templateUrl: "./simulationForm.component.html",
  styleUrls: ["./simulationForm.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule], //чтобы работало *ngIf
})
export class SimulationFormComponent {
  public M = "";
  public N = "";

  appComponentClass: AppComponent;

  constructor(_appComponentClass: AppComponent) {
    this.appComponentClass = _appComponentClass;
  }

  public stopSimulation(): void {
    this.appComponentClass.formChange.next("stopSim");
  }
  // тут пишем логику на typescript
}
