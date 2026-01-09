import { MeshBasicMaterial, SRGBColorSpace } from "three";
import Experience from "./Experience.js";

export default class Baked {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer.instance;

    this.maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();

    // 🎨 Config warna global (AMAN UNTUK BAKED)
    this.colors = {
      room1: "#ffffff",
      room2: "#ffffff",
      room3: "#ffffff",
      icons: "#ffffff",
    };

    this.setModels();
  }

  /**
   * Apply material ke semua mesh di dalam object
   */
  setMaterial(object, material) {
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  }

  /**
   * Konfigurasi texture baked
   */
  configureTexture(texture) {
    texture.flipY = false;
    texture.anisotropy = this.maxAnisotropy;
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  /**
   * Load dan setup semua model + material baked
   */
  setModels() {
    this.model = {};

    /* ==============================
       ROOM 1
    ============================== */
    this.model.room1 = this.resources.items._roomModel.scene;

    this.bakedTexture1 = this.configureTexture(
      this.resources.items.baked1
    );

    this.materialRoom1 = new MeshBasicMaterial({
      map: this.bakedTexture1,
      color: this.colors.room1,
    });

    this.setMaterial(this.model.room1, this.materialRoom1);
    this.scene.add(this.model.room1);

    /* ==============================
       ROOM 2
    ============================== */
    this.model.room2 = this.resources.items._roomModel2.scene;

    this.bakedTexture2 = this.configureTexture(
      this.resources.items.baked2
    );

    this.materialRoom2 = new MeshBasicMaterial({
      map: this.bakedTexture2,
      color: this.colors.room2,
    });

    this.setMaterial(this.model.room2, this.materialRoom2);
    this.scene.add(this.model.room2);

    /* ==============================
       ROOM 3
    ============================== */
    this.model.room3 = this.resources.items._roomModel3.scene;

    this.bakedTexture3 = this.configureTexture(
      this.resources.items.baked3
    );

    this.materialRoom3 = new MeshBasicMaterial({
      map: this.bakedTexture3,
      color: this.colors.room3,
    });

    this.setMaterial(this.model.room3, this.materialRoom3);
    this.scene.add(this.model.room3);

    /* ==============================
       ICONS / SOCIAL
    ============================== */
    this.materialIcons = new MeshBasicMaterial({
      map: this.bakedTexture3,
      color: this.colors.icons,
    });

    this.model.linkedin = this.resources.items.linkedin.scene;
    this.model.linkedin.name = "linkedin";
    this.setMaterial(this.model.linkedin, this.materialIcons);
    this.scene.add(this.model.linkedin);

    this.model.github = this.resources.items.github.scene;
    this.model.github.name = "github";
    this.setMaterial(this.model.github, this.materialIcons);
    this.scene.add(this.model.github);

    this.model.itchio = this.resources.items.itchio.scene;
    this.model.itchio.name = "itchio";
    this.setMaterial(this.model.itchio, this.materialIcons);
    this.scene.add(this.model.itchio);
  }

  /* ==============================
     PUBLIC METHODS (AMAN DIPANGGIL)
  ============================== */

  setRoomColor(room, color) {
    if (room === 1 && this.materialRoom1)
      this.materialRoom1.color.set(color);

    if (room === 2 && this.materialRoom2)
      this.materialRoom2.color.set(color);

    if (room === 3 && this.materialRoom3)
      this.materialRoom3.color.set(color);
  }

  setIconsColor(color) {
    if (this.materialIcons) {
      this.materialIcons.color.set(color);
    }
  }
}
