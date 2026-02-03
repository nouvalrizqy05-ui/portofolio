import { Mesh, MeshBasicMaterial, SRGBColorSpace, Color } from "three";
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

    // Load Textures
    this.bakedTexture1 = this.configureTexture(this.resources.items.baked1);
    this.model.material = new MeshBasicMaterial({ map: this.bakedTexture1 });

    this.bakedTexture2 = this.configureTexture(this.resources.items.baked2);
    this.model.material2 = new MeshBasicMaterial({ map: this.bakedTexture2 });

    this.bakedTexture3 = this.configureTexture(this.resources.items.baked3);
    this.model.material3 = new MeshBasicMaterial({ map: this.bakedTexture3 });

    // Material Ungu Neon untuk Arcade & Sosmed
    this.purpleNeonMaterial = this.model.material3.clone();
    this.purpleNeonMaterial.color = new Color('#8A2BE2');

    // Room Models
    this.model.room1 = this.resources.items._roomModel.scene;
    this.model.room2 = this.resources.items._roomModel2.scene;
    this.model.room3 = this.resources.items._roomModel3.scene;

    // Arcade Machine
    if (this.resources.items.arcadeMachine) {
        this.model.arcade = this.resources.items.arcadeMachine.scene;
        this.model.arcade.name = "arcadeMachine"; 
        this.setMaterial(this.model.arcade, this.purpleNeonMaterial);
        this.scene.add(this.model.arcade);
    }

    // Social Media Icons - Penamaan pada level scene agar terdeteksi Raycaster
    this.model.linkedin = this.resources.items.linkedin.scene;
    this.model.linkedin.name = "linkedin";
    
    this.model.github = this.resources.items.github.scene;
    this.model.github.name = "github";

    // Apply Materials
    this.setMaterial(this.model.room1, this.model.material);
    this.setMaterial(this.model.room2, this.model.material2);
    this.setMaterial(this.model.room3, this.model.material3);
    
    // Gunakan material ungu untuk ikon sosial
    this.setMaterial(this.model.linkedin, this.purpleNeonMaterial);
    this.setMaterial(this.model.github, this.purpleNeonMaterial);

    // Add to Scene
    this.scene.add(this.model.room1);
    this.scene.add(this.model.room2);
    this.scene.add(this.model.room3);
    this.scene.add(this.model.linkedin);
    this.scene.add(this.model.github);
  };
}
