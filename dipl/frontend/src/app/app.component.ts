import { Component, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ExampleComponent } from "./newComponentExample/example.component"; //указываем путь
import { LoginComponent } from "./login/login.component"; //указываем путь
import { BasicSetupComponent } from "./basicSetup/BasicSetup.component"; //указываем путь
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
  ], //указываем тут
  template: `
    <login-comp *ngIf="formState === 'unclicked'">Кнопку нажали</login-comp>
    <basicSetup-comp *ngIf="formState === 'vhod'"></basicSetup-comp>

    <!--
    <button (click)="buttonClk()">Менять</button>
    <login-comp *ngIf="buttonState === 'clicked'">Кнопку нажали</login-comp>
    <example-comp *ngIf="buttonState === 'unclicked'"
      >Кнопку отжали</example-comp
    >
    -->
  `,
})
export class AppComponent {
  name = "";
  public formState = "unclicked";
  public formChange = new Subject<string>();
  unsubscribe = new Subject<void>();

  public ngOnInit(): void {
    console.log("лялляля");
    this.formChange.pipe(takeUntil(this.unsubscribe)).subscribe((state) => {
      this.formState = state;
      console.log("текст", state);
    });
  }

  public buttonClk(): void {
    if (this.formState === "unclicked") {
      this.formState = "clicked";
    } else {
      this.formState = "unclicked";
    }
  }
  public ngOnDestroy(): void {
    console.log("ююююююхухх");
    this.unsubscribe.next();
  }
}
