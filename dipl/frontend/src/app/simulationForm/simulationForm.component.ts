import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
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
  @Input() M: number = 0;
  @Input() N: number = 0;

  appComponentClass: AppComponent;

  constructor(_appComponentClass: AppComponent) {
    this.appComponentClass = _appComponentClass;
  }

  public stopSimulation(): void {
    this.appComponentClass.formChange.next("stopSim");
  }
  // тут пишем логику на typescript
  private cockroaches: { update: (t: number) => void }[] = [];

  ngOnInit(): void {
    const bugIcons = document.getElementsByClassName("bug-icon");
    for (let i = 0; i < bugIcons.length; i++) {
      this.makeCockroach(bugIcons[i] as HTMLElement);
    }
    this.step();
  }

  makeCockroach(icon: HTMLElement): { update: (t: number) => void } {
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

    const update = (t: number) => {
      const rect: DOMRect | null = document
        .querySelector(".field")
        ?.getBoundingClientRect();
      if (!rect) return; // Проверка на наличие rect

      if (t >= lastTargetTime + 3) {
        p.remove;
        tx = Math.random() * (rect.width - 20); // Ограничение по ширине
        ty = Math.random() * (rect.height - 20); // Ограничение по высоте
        console.log("coords", tx, ty);
        //t = t * 1000;
        lastTargetTime = t;
      }

      const dt: number = t - lastT;
      const app = document.getElementsByClassName("field")[0];

      p.src = "https://svgshare.com/i/t12.svg";
      p.style.position = "absolute";
      p.style.left = tx + "px";
      p.style.top = ty + "px";

      app?.appendChild(p);
      (app as HTMLElement).style.backgroundColor = "red";
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
      console.log("xxx", tx, ty);
      for (let frame = 0; frame < 20; frame++) {
        x += dt * vspeed * Math.cos(a);
        y += dt * vspeed * Math.sin(a);
      }
      icon.style.left = x + "px";
      icon.style.top = y + "px";
      icon.style.transform = "rotate(" + ((180 * a) / Math.PI - 135) + "deg)";
      lastT = t;
    };

    const cockroach = { update: update };
    this.cockroaches.push(cockroach);
    return cockroach;
  }

  step() {
    const t: number = performance.now() / 1000;
    for (const cockroach of this.cockroaches) {
      cockroach.update(t);
    }
    window.requestAnimationFrame(() => this.step());
  }
}
