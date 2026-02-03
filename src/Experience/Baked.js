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

    // 1. Load Textures Ruangan
    this.bakedTexture1 = this.configureTexture(this.resources.items.baked1);
    this.model.material = new MeshBasicMaterial({ map: this.bakedTexture1 });

    this.bakedTexture2 = this.configureTexture(this.resources.items.baked2);
    this.model.material2 = new MeshBasicMaterial({ map: this.bakedTexture2 });

    this.bakedTexture3 = this.configureTexture(this.resources.items.baked3);
    this.model.material3 = new MeshBasicMaterial({ map: this.bakedTexture3 });

    // 2. Material Ungu Neon untuk Arcade & Sosmed
    this.purpleNeonMaterial = this.model.material3.clone();
    this.purpleNeonMaterial.color = new Color('#8A2BE2');

    // 3. Load Model Ruangan
    this.model.room1 = this.resources.items._roomModel.scene;
    this.model.room2 = this.resources.items._roomModel2.scene;
    this.model.room3 = this.resources.items._roomModel3.scene;

    // 4. Konfigurasi Arcade Machine
    if (this.resources.items.arcadeMachine) {
        this.model.arcade = this.resources.items.arcadeMachine.scene;
        this.model.arcade.name = "arcadeMachine"; 
        this.setMaterial(this.model.arcade, this.purpleNeonMaterial);
        this.scene.add(this.model.arcade);
    }

    // --- REVISI POSISI PHOTO FRAME ---
    if (this.resources.items.myPhoto) {
        const photoTexture = this.resources.items.myPhoto;
        photoTexture.colorSpace = SRGBColorSpace;

        // Bingkai Glow Belakang
        const frameGlowMaterial = new MeshBasicMaterial({ 
            color: new Color('#5D4037'),
            side: DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        this.model.photoFrameBack = new Mesh(new PlaneGeometry(0.56, 0.56), frameGlowMaterial);

        // Foto Utama
        const photoMaterial = new MeshStandardMaterial({
            map: photoTexture,
            emissive: new Color('#8A2BE2'),
            emissiveIntensity: 0.5,
            side: DoubleSide
        });
        this.model.photoFrame = new Mesh(new PlaneGeometry(0.5, 0.5), photoMaterial);

        // POSISI BARU: Menyesuaikan dengan area hitam di dinding di atas meja
        // Angka ini digeser agar menjauh dari area kursi (sumbu X dan Y dinaikkan)
        const posX = -0.85; // Tetap di sisi dinding kanan/belakang
        const posY = 2.65; // Dinaikkan ke atas agar sejajar dengan baris ikon
        const posZ = -4.75; // Kedalaman dinding

        this.model.photoFrame.position.set(posX, posY, posZ);
        this.model.photoFrameBack.position.set(posX, posY, posZ - 0.01);

        this.model.photoFrame.name = "photoFrame"; 
        this.scene.add(this.model.photoFrame, this.model.photoFrameBack);
    }

    // 5. Ikon Sosial Media
    this.model.linkedin = this.resources.items.linkedin.scene;
    this.model.linkedin.name = "linkedin";
    this.model.github = this.resources.items.github.scene;
    this.model.github.name = "github";

    // 6. Apply Materials & Add to Scene
    this.setMaterial(this.model.room1, this.model.material);
    this.setMaterial(this.model.room2, this.model.material2);
    this.setMaterial(this.model.room3, this.model.material3);
    this.setMaterial(this.model.linkedin, this.purpleNeonMaterial);
    this.setMaterial(this.model.github, this.purpleNeonMaterial);

    this.scene.add(this.model.room1, this.model.room2, this.model.room3, this.model.linkedin, this.model.github);
  };
}
