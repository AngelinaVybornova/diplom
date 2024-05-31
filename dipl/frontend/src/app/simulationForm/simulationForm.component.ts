import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "../app.component";
import { Svg } from "./svgImage";
import { CurrentState, User, UserData } from "../models/models";
import { lastValueFrom } from "rxjs";
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

  constructor(_appComponentClass: AppComponent, private http: HttpClient) {
    this.appComponentClass = _appComponentClass;
  }

  public stopSimulation(): void {
    this.appComponentClass.formChange.next("stopSim");
  }
  // тут пишем логику на typescript
  public animals = 3;
  private cockroaches: { update: (t: number, isUpd: boolean) => void }[] = [];

  ngOnInit(): void {
    this.svgClass = new Svg();
    console.log("state", this.state);
    this.userData.User = this.user;
    this.userData.CurrentState = this.state;
    this.creatureHTML();
    this.callNewState();
    console.log("newState", this.userData.CurrentState);
    const bugIcons = document.getElementsByClassName("bug-icon");
    for (let i = 0; i < bugIcons.length; i++) {
      this.makeCockroach(bugIcons[i] as HTMLElement);
    }
    this.step();
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

    const app = document.getElementsByClassName("field")[0];

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
      microorganism.innerHTML = haed;

      app?.appendChild(microorganism);
    }
    //rgb(255, 0, 0)
    // Создание словаря для сопоставления чисел с переменными
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
    const p = document.createElement("img");
    let lastT: number = 0;
    let lastTargetTime: number = -100;
    let a: number = 0;
    let x: number = Math.random() * (rect1.width - 20);
    let y: number = Math.random() * (rect1.width - 20);
    let tx: number = Math.random() * (rect1.width - 20);
    let ty: number = Math.random() * (rect1.width - 20);
    let dxy: number = 0;

    const svg = document.createElement("div");
    /*
    svg.classList.add("bug-icon");
    const desiredColor = "#00fa00";
    let add1 = this.svgClass.body1;
    add1 = add1.replace(/fill="#000000"/, `fill="${desiredColor}"`);
    svg.innerHTML = add1;
    */
    //svg.classList.add("bug-icon");

    const app = document.getElementsByClassName("field")[0];
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

      if (t >= lastTargetTime + 3 && isUpd == true) {
        //----------------Вызов метода для вызова бека--------------
        p.remove;
        svg.remove;
        tx = Math.random() * (rect.width - 20); // Ограничение по ширине
        ty = Math.random() * (rect.height - 20); // Ограничение по высоте
        //console.log("coords", tx, ty);
        //t = t * 1000;
        lastTargetTime = t;
        console.log("счет", isUpd);
      } else if (t >= lastTargetTime + 3 && isUpd == false) {
        p.remove;
        svg.remove;
        tx = Math.random() * (rect.width - 20); // Ограничение по ширине
        ty = Math.random() * (rect.height - 20); // Ограничение по высоте
        //console.log("coords", tx, ty);
        //t = t * 1000;
        lastTargetTime = t;
        console.log("счет", isUpd);
      }

      const dt: number = t - lastT;

      //svg.innerHTML = "";
      p.src = "https://svgshare.com/i/t12.svg";
      p.style.position = "absolute";
      p.style.left = tx + "px";
      p.style.top = ty + "px";

      app?.appendChild(p);

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
    let count = 0;
    let isUpd: boolean = false;
    for (const cockroach of this.cockroaches) {
      count = count + 1;
      if (count == this.animals) {
        isUpd = true;
        count = 0;
      }
      cockroach.update(t, isUpd);
      isUpd = false;
    }
    window.requestAnimationFrame(() => this.step());
  }

  public async mainSimLoop(data: UserData): Promise<CurrentState> {
    return (await lastValueFrom(
      this.http.post(`http://localhost:4201/evoSim/mainSimLoop`, data)
    )) as Promise<CurrentState>;
  }
}
