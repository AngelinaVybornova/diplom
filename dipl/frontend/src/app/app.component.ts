import { Component, NgModule } from "@angular/core";
import {FormsModule} from "@angular/forms";
import {ExampleComponent} from "./newComponentExample/example.component"; //указываем путь
import { CommonModule } from "@angular/common";

@Component({
    selector: "my-app",
    standalone: true,
    imports: [FormsModule, ExampleComponent, CommonModule], //указываем тут
    template: `<label>Введите имя:</label>
                 <input [(ngModel)]="name" placeholder="name">
                 <h1>Добро пожаловать {{name}}!</h1>
                 <div>А вот так мы вставляем компоненты:</div>
                 <example-comp>название тега берем из selector вставляемого компонента</example-comp>`
})
export class AppComponent { 
    name= "";
}