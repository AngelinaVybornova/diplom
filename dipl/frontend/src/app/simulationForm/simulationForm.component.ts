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
  copyState: CurrentState;

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
  private cockroaches: { update: (t: number, isUpd: boolean) => void }[] = [];

  ngOnInit(): void {
    this.svgClass = new Svg();
    console.log("state", this.state);
    this.userData.User = this.user;
    this.userData.CurrentState = this.state;
    this.creatureHTML();
    this.copyState = JSON.parse(JSON.stringify(this.userData.CurrentState));
    this.callNewState();
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

    const app = document.getElementsByClassName("header")[0];

    for (let i = 0; i < this.userData.CurrentState.animals.length; i++) {
      let microorganism = document.createElement("div");
      microorganism.style.position = "absolute";
      microorganism.classList.add("bug-icon");
      let body = numberToBody.get(
        this.userData.CurrentState.animals[i].decipheredGenome.bodyType
      );
      let haed = numberToHead.get(
        this.userData.CurrentState.animals[i].decipheredGenome.headType
      );
      let eye = numberToEye.get(
        this.userData.CurrentState.animals[i].decipheredGenome.eyeType
      );
      let mounth = numberToMounth.get(
        this.userData.CurrentState.animals[i].decipheredGenome.mouthType
      );
      let additional = numberToAdditional.get(
        this.userData.CurrentState.animals[i].decipheredGenome.additionalType
      );
      console.log(
        "цвет",
        this.userData.CurrentState.animals[i].decipheredGenome.bodyColor.b
      );
      let rgb = `rgb(${this.userData.CurrentState.animals[i].decipheredGenome.bodyColor.r}, ${this.userData.CurrentState.animals[i].decipheredGenome.bodyColor.g}, ${this.userData.CurrentState.animals[i].decipheredGenome.bodyColor.b})`;

      body = body.replace(/fill="#000000"/, `fill="${rgb}"`);
      additional = additional.replace(/fill="#000000"/, `fill="${rgb}"`);
      rgb = `rgb(${this.userData.CurrentState.animals[i].decipheredGenome.headColor.r}, ${this.userData.CurrentState.animals[i].decipheredGenome.headColor.g}, ${this.userData.CurrentState.animals[i].decipheredGenome.headColor.b})`;
      haed = haed.replace(/fill="#000000"/, `fill="${rgb}"`);
      mounth = mounth.replace(/fill="#000000"/, `fill="${rgb}"`);
      rgb = `rgb(${this.userData.CurrentState.animals[i].decipheredGenome.eyeColor.r}, ${this.userData.CurrentState.animals[i].decipheredGenome.eyeColor.g}, ${this.userData.CurrentState.animals[i].decipheredGenome.eyeColor.b})`;
      eye = eye.replace(/fill="#000000"/, `fill="${rgb}"`);
      let animalVid: string = body + eye + mounth + additional;

      haed = haed.replace(/<\/svg>/, `${animalVid}</svg>`);
      microorganism.style.left =
        this.userData.CurrentState.animals[i].coordinates[0] + "px";
      microorganism.style.top =
        this.userData.CurrentState.animals[i].coordinates[1] + "px";
      microorganism.innerHTML = haed;

      app?.appendChild(microorganism);
    }
    for (let i = 0; i < this.userData.CurrentState.food.length; i++) {
      let foods = document.createElement("div");
      foods.style.position = "absolute";
      foods.style.left =
        this.userData.CurrentState.food[i].coordinates[0] + "px";
      foods.style.top =
        this.userData.CurrentState.food[i].coordinates[1] + "px";
      foods.classList.add("food-icon");
      let food: string;
      if (this.userData.CurrentState.food[i].type == true) {
        food = this.svgClass.meat;
      } else {
        food = this.svgClass.grass;
      }
      foods.innerHTML = food;

      app?.appendChild(foods);
    }
  }

  makeCockroach(icon: HTMLElement): {
    update: (t: number, isUpd: boolean) => void;
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
    let a: number = 0;
    let x: number = this.copyState.animals[0].coordinates[0];
    let y: number = this.copyState.animals[0].coordinates[1];
    let tx: number = this.userData.CurrentState.animals[this.ix].coordinates[0];
    let ty: number = this.userData.CurrentState.animals[this.ix].coordinates[0];
    let dxy: number = 0;
    console.log(
      "координаты",
      this.userData.CurrentState.food[0].coordinates[1]
    );
    const svg = document.createElement("div");
    /*
    svg.classList.add("bug-icon");
    const desiredColor = "#00fa00";
    let add1 = this.svgClass.body1;
    add1 = add1.replace(/fill="#000000"/, `fill="${desiredColor}"`);
    svg.innerHTML = add1;
    */
    //svg.classList.add("bug-icon");

    //const app = document.getElementsByClassName("field")[0];
    /*
    const desiredColor = "rgb(255, 0, 0)";
    let add1 = this.svgClass.head1;
    add1 = add1.replace(/fill="#000000"/, `fill="${desiredColor}"`);
    svg.innerHTML = add1;
    console.log("картинка", svg);
    app?.appendChild(svg);
    */

    const update = (t: number, isUpd: boolean) => {
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
        lastTargetTime = t;
        this.countAnimals();
        console.log("счет", isUpd);
      } /*else if (t >= lastTargetTime + 5 && isUpd == false) {
        //document.getElementById("bug-container").innerHTML = "";
        //document.getElementById("fieldHTML").innerHTML = "";
        //icon.remove;
        p.remove;
        //svg.remove;
        tx = Math.random() * (rect.width - 20); // Ограничение по ширине
        ty = Math.random() * (rect.height - 20); // Ограничение по высоте
        //console.log("coords", tx, ty);
        //t = t * 1000;
        lastTargetTime = t;
        console.log("счет", isUpd);

      }*/

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
      } else {
        a = Math.max(ta, a2 - dt * aspeed);
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
    let isUpd: boolean = false;
    for (const cockroach of this.cockroaches) {
      cockroach.update(t, isUpd);
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
  countAnimals(): void {
    this.animalsCount++;
    if (this.animalsCount == this.userData.CurrentState.animals.length) {
      this.removeCockroaches();
      this.creatureHTML();
      this.state = JSON.parse(JSON.stringify(this.userData.CurrentState));
      console.log("старый пакет", this.state);

      // Вызываем callNewState() после вывода старого состояния
      this.callNewState();
      console.log("новый пакет", this.userData.CurrentState);
      console.log("проверка старого пакета", this.state);

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
