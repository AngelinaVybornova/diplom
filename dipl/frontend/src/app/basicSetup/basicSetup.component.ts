import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

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

  public firstPopulation(): void {
    //mm
  }
  public autoPopulation(): void {
    //mm
  }

  public buttonClk(): void {
    if (this.buttonState === "unclicked") {
      this.buttonState = "clicked";
      console.log("click", this.buttonState); //так выводим логи для дебага, смотри их в консоли браузера
    } else {
      this.buttonState = "unclicked";
      console.log("unclick", this.buttonState);
    }
  }
  // тут пишем логику на typescript
}
