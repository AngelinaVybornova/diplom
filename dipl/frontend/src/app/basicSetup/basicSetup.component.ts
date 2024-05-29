import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "../app.component";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from '@angular/common/http';
import { CurrentState, MapSettings, User, UserFirstRandom, UserFirstSettings } from "../models/models";
import { Observable, lastValueFrom } from "rxjs";

@Component({
  selector: "basicSetup-comp",
  templateUrl: "./basicSetup.component.html",
  styleUrls: ["./basicSetup.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], //чтобы работало *ngIf
})
export class BasicSetupComponent {
  @Input() user: User;

  public buttonState = "unclicked";
  public bM: number;
  public bN: number;
  public foodProbability: number = 0;
  public maxOrgNum: number = 0;

  appComponentClass: AppComponent;
  state: CurrentState;
  constructor(_appComponentClass: AppComponent, private http: HttpClient) {
    this.appComponentClass = _appComponentClass;
    //console.log("basic", this.user);
  }

  @Output() onChanged = new EventEmitter<{ bM: number; bN: number }>();
  @Output() stateFormed = new EventEmitter<CurrentState>();
  public async buttonClkStartSimulation(bM: number, bN: number): Promise<void> {
    this.onChanged.emit({ bM, bN });
    const mapSettings = new MapSettings();
    mapSettings.size = [this.bM, this.bN];
    mapSettings.animalsCap = this.maxOrgNum;
    mapSettings.foodAppearenceProb = this.foodProbability;
    const userFirstRandom = new UserFirstRandom();
    userFirstRandom.User = this.user;
    userFirstRandom.mapSettings = mapSettings;
    this.state = await this.generateRandomly(userFirstRandom);
    console.log("state", this.state);
    this.appComponentClass.formChange.next("startSim");
    this.stateFormed.emit(this.state);
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

  public async generateRandomly(data: UserFirstRandom): Promise<CurrentState> {
    return await lastValueFrom(this.http.post(`http://localhost:4201/evoSim/generateRandomly`, data)) as Promise<CurrentState>;
  }

  public async generateFromSettings(data: UserFirstSettings): Promise<CurrentState> {
    return await lastValueFrom(this.http.post(`http://localhost:4201/evoSim/generateFromSettings`, data)) as Promise<CurrentState>; //не проверено
  }
}
