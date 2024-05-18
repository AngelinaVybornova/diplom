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
    <basicSetup-comp *ngIf="formState === 'registration'"></basicSetup-comp>
  `,
})
export class AppComponent {
  name = "";
  public formState = "unclicked";
  public formChange = new Subject<string>();
  unsubscribe = new Subject<void>();

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
