import { Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, Color, DoubleSide } from "three";
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

    // --- REVISI: PHOTO FRAME GLOW ---
    if (this.resources.items.myPhoto) {
        const photoTexture = this.resources.items.myPhoto;
        photoTexture.colorSpace = SRGBColorSpace;

        // 1. Bingkai Glow (Bagian belakang yang menyala)
        const frameGlowMaterial = new MeshBasicMaterial({ 
            color: new Color('#8A2BE2'),
            side: DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        this.model.photoFrameBack = new Mesh(new PlaneGeometry(0.56, 0.56), frameGlowMaterial);

        // 2. Foto Utama (Menggunakan MeshStandardMaterial agar bisa Emissive)
        const photoMaterial = new MeshStandardMaterial({
            map: photoTexture,
            emissive: new Color('#8A2BE2'),
            emissiveIntensity: 0.4,
            side: DoubleSide
        });
        this.model.photoFrame = new Mesh(new PlaneGeometry(0.5, 0.5), photoMaterial);

        // Atur Posisi (Gantikan koordinat itchio lama - contoh di tembok dekat meja)
        const posX = 1.45, posY = 1.2, posZ = -1.98;
        this.model.photoFrame.position.set(posX, posY, posZ);
        this.model.photoFrameBack.position.set(posX, posY, posZ - 0.01);
        
        // Sesuaikan rotasi jika perlu
        // this.model.photoFrame.rotation.y = Math.PI * 0.5;
        // this.model.photoFrameBack.rotation.y = Math.PI * 0.5;

        this.model.photoFrame.name = "photoFrame"; // Untuk Raycaster
        this.scene.add(this.model.photoFrame, this.model.photoFrameBack);
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
    this.setMaterial(this.model.linkedin, this.purpleNeonMaterial);
    this.setMaterial(this.model.github, this.purpleNeonMaterial);

    // Add to Scene
    this.scene.add(this.model.room1, this.model.room2, this.model.room3, this.model.linkedin, this.model.github);
  };
}
