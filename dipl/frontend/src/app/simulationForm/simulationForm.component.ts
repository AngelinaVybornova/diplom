import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "../app.component";
import { Svg } from "./svgImage";
import { CurrentState, User, UserData } from "../models/models";
import { count, lastValueFrom } from "rxjs";
import { HttpClient, HttpClientModule } from "@angular/common/http";

@Component({
  selector: "simulationForm-comp",
  templateUrl: "./simulationForm.component.html",
  styleUrls: ["./simulationForm.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], //чтобы работало *ngIf
})
export class SimulationFormComponent {
  @Input() M: number = 0;
  @Input() N: number = 0;
  @Input() user: User;
  @Input() state: CurrentState;

  appComponentClass: AppComponent;
  svgClass: Svg;
  userData = new UserData();
  public buttonClkVihod(): void {
    this.appComponentClass.formChange.next("vihod");
  }

  constructor(_appComponentClass: AppComponent, private http: HttpClient) {
    this.appComponentClass = _appComponentClass;
  }

  public stopSimulation(): void {
    this.appComponentClass.formChange.next("stopSim");
  }
  // тут пишем логику на typescript
  public animalsCount: number = 0;
  public ix: number;
  private cockroaches: { update: (t: number) => void }[] = [];

  async ngOnInit(): Promise<void> {
    this.svgClass = new Svg();
    console.log("state", this.state);
    this.userData.User = this.user;
    this.userData.CurrentState = this.state;
    this.creatureHTML();
    this.state = JSON.parse(JSON.stringify(this.userData.CurrentState));
    await this.callNewState();
    console.log("newState", this.userData.CurrentState);
    this.challengeMakeCockroach();
    this.step();
    console.log("длина животных", this.userData.CurrentState.animals.length);
  }
  challengeMakeCockroach(): void {
    const bugIcons = document.getElementsByClassName("bug-icon");
    for (this.ix = 0; this.ix < bugIcons.length; this.ix++) {
      this.makeCockroach(bugIcons[this.ix] as HTMLElement);
    }
  }

  async callNewState() {
    this.userData.CurrentState = await this.mainSimLoop(this.userData);
  }

  creatureHTML(): void {
    const numberToBody = new Map<number, string>([
      [0, this.svgClass.body1],
      [1, this.svgClass.body2],
      [10, this.svgClass.body3],
      [11, this.svgClass.body4],
    ]);
    const numberToHead = new Map<number, string>([
      [0, this.svgClass.head1],
      [1, this.svgClass.head2],
      [10, this.svgClass.head3],
      [11, this.svgClass.head4],
    ]);
    const numberToEye = new Map<number, string>([
      [0, this.svgClass.eye1],
      [1, this.svgClass.eye2],
      [10, this.svgClass.eye3],
      [11, this.svgClass.eye4],
    ]);
    const numberToMounth = new Map<number, string>([
      [0, this.svgClass.mouth1],
      [1, this.svgClass.mouth2],
      [10, this.svgClass.mouth3],
      [11, this.svgClass.mouth4],
    ]);
    const numberToAdditional = new Map<number, string>([
      [0, this.svgClass.add1],
      [1, this.svgClass.add2],
      [10, this.svgClass.add3],
      [11, this.svgClass.add4],
    ]);
    const rect1: DOMRect | null = document
      .querySelector(".field")
      ?.getBoundingClientRect();

    const app = document.getElementsByClassName("header")[0];

    for (let i = 0; i < this.state.animals.length; i++) {
      let microorganism = document.createElement("div");
      microorganism.style.position = "absolute";
      microorganism.classList.add("bug-icon");
      let body = numberToBody.get(
        this.state.animals[i].decipheredGenome.bodyType
      );
      let haed = numberToHead.get(
        this.state.animals[i].decipheredGenome.headType
      );
      let eye = numberToEye.get(this.state.animals[i].decipheredGenome.eyeType);
      let mounth = numberToMounth.get(
        this.state.animals[i].decipheredGenome.mouthType
      );
      let additional = numberToAdditional.get(
        this.state.animals[i].decipheredGenome.additionalType
      );
      console.log("цвет", this.state.animals[i].decipheredGenome.bodyColor.b);
      let rgb = `rgb(${this.state.animals[i].decipheredGenome.bodyColor.r}, ${this.state.animals[i].decipheredGenome.bodyColor.g}, ${this.state.animals[i].decipheredGenome.bodyColor.b})`;

      body = body.replace(/fill="#000000"/, `fill="${rgb}"`);
      additional = additional.replace(/fill="#000000"/, `fill="${rgb}"`);
      rgb = `rgb(${this.state.animals[i].decipheredGenome.headColor.r}, ${this.state.animals[i].decipheredGenome.headColor.g}, ${this.state.animals[i].decipheredGenome.headColor.b})`;
      haed = haed.replace(/fill="#000000"/, `fill="${rgb}"`);
      mounth = mounth.replace(/fill="#000000"/, `fill="${rgb}"`);
      rgb = `rgb(${this.state.animals[i].decipheredGenome.eyeColor.r}, ${this.state.animals[i].decipheredGenome.eyeColor.g}, ${this.state.animals[i].decipheredGenome.eyeColor.b})`;
      eye = eye.replace(/fill="#000000"/, `fill="${rgb}"`);
      let animalVid: string = body + eye + mounth + additional;

      haed = haed.replace(/<\/svg>/, `${animalVid}</svg>`);
      microorganism.style.left =
        this.state.animals[i].coordinates[0] - rect1.width / 2 + "px";
      microorganism.style.top =
        this.state.animals[i].coordinates[1] + 100 - rect1.height / 2 + "px";
      microorganism.innerHTML = haed;

      app?.appendChild(microorganism);
    }
    for (let i = 0; i < this.state.food.length; i++) {
      let foods = document.createElement("div");
      foods.style.position = "absolute";
      foods.style.left =
        this.state.food[i].coordinates[0] - rect1.width / 2 + "px";
      foods.style.top =
        this.state.food[i].coordinates[1] + 100 - rect1.height / 2 + "px";
      foods.classList.add("food-icon");
      let food: string;
      if (this.state.food[i].type == true) {
        food = this.svgClass.meat;
      } else {
        food = this.svgClass.grass;
      }
      foods.innerHTML = food;

      app?.appendChild(foods);
    }
  }

  makeCockroach(icon: HTMLElement): {
    update: (t: number) => void;
  } {
    const rect1: DOMRect | null = document
      .querySelector(".field")
      ?.getBoundingClientRect();
    if (!rect1) return { update: () => {} }; // Проверка на наличие rect
    let vspeed: number = 50;
    const aspeed: number = 10 * Math.PI;
    //const p = document.createElement("img");
    let lastT: number = 0;
    let lastTargetTime: number = -100;
    let a: number = 0; //this.state.animals[this.ix].turnAngle;
    let tx: number;
    let ty: number;
    if (
      this.state.animals.length > this.userData.CurrentState.animals.length &&
      this.ix > this.userData.CurrentState.animals.length - 1
    ) {
      tx = this.state.animals[this.ix].coordinates[0] - rect1.width / 2;
      ty = this.state.animals[this.ix].coordinates[1] + 100 - rect1.height / 2;
      console.log(
        "координаты state x",
        this.state.animals[this.ix].coordinates[0]
      );
    } else {
      tx =
        this.userData.CurrentState.animals[this.ix].coordinates[0] -
        rect1.width / 2;
      ty =
        this.userData.CurrentState.animals[this.ix].coordinates[1] +
        100 -
        rect1.height / 2;
      console.log(
        "координаты userData x",
        this.userData.CurrentState.animals[this.ix].coordinates[0]
      );
    }
    let x: number =
      this.state.animals[this.ix].coordinates[0] - rect1.width / 2;
    let y: number =
      this.state.animals[this.ix].coordinates[1] + 100 - rect1.height / 2;
    //let tx: number = this.userData.CurrentState.animals[this.ix].coordinates[0];
    //let ty: number = this.userData.CurrentState.animals[this.ix].coordinates[1];
    let dxy: number = 0;

    const update = (t: number) => {
      const rect: DOMRect | null = document
        .querySelector(".field")
        ?.getBoundingClientRect();
      if (!rect) return; // Проверка на наличие rect

      if (t >= lastTargetTime + 3 /*&& isUpd == true*/) {
        //document.getElementById("bug-container").innerHTML = "";
        //p.remove;
        //svg.remove;
        //tx = Math.random() * (rect.width - 20); // Ограничение по ширине
        //ty = Math.random() * (rect.height - 20); // Ограничение по высоте
        //console.log("coords", tx, ty);
        //t = t * 1000;

        this.countAnimals();
        lastTargetTime = t;
      }
      const dt: number = t - lastT;
      //console.log("картинка", icon);

      //svg.innerHTML = "";
      //p.src = "https://svgshare.com/i/t12.svg";
      //p.style.position = "absolute";
      //p.style.left = tx + "px";
      //p.style.top = ty + "px";

      //app?.appendChild(p);

      //(app as HTMLElement).style.backgroundColor = "red";
      //console.log("новое", tx, ty);

      dxy = Math.sqrt(Math.pow(tx - x, 2) + Math.pow(ty - y, 2)) / 1000;
      vspeed = dxy / dt;
      //console.log("скорость", vspeed, dt, dxy);

      const ta: number = Math.atan2(ty - y, tx - x);
      for (; a < ta; a += 2 * Math.PI) {}
      for (; a > ta; a -= 2 * Math.PI) {}
      const a2: number = a + 2 * Math.PI;
      if (ta - a < a2 - ta) {
        a = Math.min(ta, a + dt * aspeed);
        //this.userData.CurrentState.animals[this.ix].turnAngle = a;
      } else {
        a = Math.max(ta, a2 - dt * aspeed);
        //this.userData.CurrentState.animals[this.ix].turnAngle = a;
      }
      //console.log("xxx", tx, ty);
      for (let frame = 0; frame < 30; frame++) {
        x += dt * vspeed * Math.cos(a);
        y += dt * vspeed * Math.sin(a);
      }
      icon.style.left = x + "px";
      icon.style.top = y + "px";
      icon.style.transform = "rotate(" + ((180 * a) / Math.PI - 270) + "deg)";
      lastT = t;
    };

    const cockroach = { update: update };
    this.cockroaches.push(cockroach);
    return cockroach;
  }

  step() {
    const t: number = performance.now() / 1000;
    let int = 1;
    let i;
    /*if (
      this.userData.CurrentState.animals.length <= this.state.animals.length
    ) {
      i = this.userData.CurrentState.animals.length - 1;
    } else {
      i = this.state.animals.length - 1;
    }*/
    for (let i = 0; i < this.cockroaches.length; i++) {
      const cockroach = this.cockroaches[i];
      cockroach.update(t);
      //count = count + 1;
      //if (count == this.userData.CurrentState.animals.length) {
      //isUpd = true;
      //count = 1;
      //}
      //isUpd = false;
    }
    console.log("число", int++);
    window.requestAnimationFrame(() => this.step());
  }
  async countAnimals(): Promise<void> {
    this.animalsCount++;
    if (this.animalsCount == this.state.animals.length) {
      this.removeCockroaches();
      this.creatureHTML();
      this.state = JSON.parse(JSON.stringify(this.userData.CurrentState));
      console.log("старый пакет", this.state);

      await this.callNewState();
      console.log("новый пакет", this.userData.CurrentState);
      this.challengeMakeCockroach();
      this.step();
      this.animalsCount = 0;
    }
  }
  removeCockroaches(): void {
    this.cockroaches = []; // Очистка массива тараканов
    const bugIcons = document.querySelectorAll(".bug-icon");
    bugIcons.forEach((bugIcon) => bugIcon.remove()); // Удаление элементов из DOM
    const foodIcons = document.querySelectorAll(".food-icon");
    foodIcons.forEach((foodIcon) => foodIcon.remove()); // Удаление элементов из DOM
  }

  public async mainSimLoop(data: UserData): Promise<CurrentState> {
    return (await lastValueFrom(
      this.http.post(`http://localhost:4201/evoSim/mainSimLoop`, data)
    )) as Promise<CurrentState>;
  }
}
