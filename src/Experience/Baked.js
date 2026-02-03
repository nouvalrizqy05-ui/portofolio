import { Mesh, MeshBasicMaterial, SRGBColorSpace, Color } from "three"; // Menambahkan Color
import Experience from "./Experience.js";

export default class Baked {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer.instance;
    this.maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.setModels();
  }

  setMaterial = (object, material) => {
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  };

  configureTexture = (texture) => {
    texture.anisotropy = this.maxAnisotropy;
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  };

  setModels = () => {
    this.model = {};

    // Room 1
    this.model.room1 = this.resources.items._roomModel.scene;
    this.bakedTexture1 = this.configureTexture(this.resources.items.baked1);
    this.model.material = new MeshBasicMaterial({
      map: this.bakedTexture1,
    });

    // Room 2
    this.model.room2 = this.resources.items._roomModel2.scene;
    this.bakedTexture2 = this.configureTexture(this.resources.items.baked2);
    this.model.material2 = new MeshBasicMaterial({
      map: this.bakedTexture2,
    });

    // Room 3
    this.model.room3 = this.resources.items._roomModel3.scene;
    this.bakedTexture3 = this.configureTexture(this.resources.items.baked3);
    this.model.material3 = new MeshBasicMaterial({
      map: this.bakedTexture3,
    });

    // MODIFIKASI ARCADE: Mengambil model arcade dan mengganti nuansanya ke Ungu
    // Pastikan nama 'arcadeMachine' sesuai dengan yang ada di assets.js
    if (this.resources.items.arcadeMachine) {
        this.model.arcade = this.resources.items.arcadeMachine.scene;
        
        // Kita gunakan material utama (misal material1) lalu di-clone agar tidak merubah tembok
        this.arcadeMaterial = this.model.material.clone(); 
        
        // Mengubah tint warna ke Ungu (Purple)
        // Karena dasar tekstur Anda mungkin sudah gelap (hitam), tint ini akan merubah list/highlight menjadi ungu
        this.arcadeMaterial.color = new Color('#8A2BE2'); // BlueViolet / Ungu
        
        this.setMaterial(this.model.arcade, this.arcadeMaterial);
        this.scene.add(this.model.arcade);
    }

    // Social Media Icons
    this.model.linkedin = this.resources.items.linkedin.scene;
    this.model.linkedin.name = "linkedin";
    this.model.github = this.resources.items.github.scene;
    this.model.github.name = "github";

    // Apply Materials
    this.setMaterial(this.model.room1, this.model.material);
    this.setMaterial(this.model.room2, this.model.material2);
    this.setMaterial(this.model.room3, this.model.material3);
    this.setMaterial(this.model.linkedin, this.model.material3);
    this.setMaterial(this.model.github, this.model.material3);

    // Add to Scene
    this.scene.add(this.model.room1);
    this.scene.add(this.model.room2);
    this.scene.add(this.model.room3);
    this.scene.add(this.model.linkedin);
    this.scene.add(this.model.github);
  };
}
