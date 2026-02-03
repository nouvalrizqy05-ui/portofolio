import Experience from "./Experience.js";
import { TOP_CHAIR_POSITION } from "./constants.js";
import { Color } from "three"; // Pastikan mengimport Color dari three

export default class TopChair {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.time = this.experience.time;

    // Melakukan clone agar material ini unik hanya untuk kursi
    this.materialTopChair = this.experience.world.baked.model.material2.clone();
    
    // Mengatur warna ke Hitam (Gunakan abu-abu sangat gelap agar detail tekstur tetap terlihat)
    this.materialTopChair.color = new Color('#5D4037');

    this.setModel();
    this.startAnimation();
  }

  setModel() {
    this.model = {};

    this.model.group = this.resources.items.topChairModel.scene;
    this.model.group.position.copy(TOP_CHAIR_POSITION);
    this.scene.add(this.model.group);

    this.model.group.traverse((child) => {
      if (child.isMesh) {
        child.material = this.materialTopChair;
      }
    });
  }

  startAnimation() {
    this.startTime = Date.now();
    this.update();
  }

  update() {
    if (!this.startTime) {
      return;
    }
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.startTime;
    // Animasi rotasi kursi
    this.model.group.rotation.y = Math.sin(elapsedTime * 0.0003) * 0.5;
  }
}
