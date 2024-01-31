import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
     
@Component({
    selector: "example-comp",
    templateUrl: "./example.component.html",
    styleUrls: ["./example.component.scss"],
    standalone: true,
    imports: [CommonModule] //чтобы работало *ngIf
})
export class ExampleComponent {
    public buttonState = "unclicked";

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