import { Vector2, ShaderMaterial, DoubleSide, NoBlending, PlaneGeometry, Mesh } from "three";
import Experience from "./Experience.js";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import fragmentShader from "./shaders/screenEffect/fragment.glsl";
import vertexShader from "./shaders/screenEffect/vertex.glsl";
import {
  ARCADE_SCREEN_WIDTH, ARCADE_SCREEN_HEIGHT, ARCADE_CSS_OBJECT_SCALE,
  ARCADE_CSS_OBJECT_POSITION, ARCADE_CSS_OBJECT_ROTATION_X,
  ARCADE_CSS_OBJECT_ROTATION_Y, CRT_UNIFORMS, ARCADE_IFRAME_SRC, ARCADE_IFRAME_PADDING
} from "./constants.js";

export default class ArcadeScreen {
  constructor() {
    this.experience = new Experience();
    this.webglElement = this.experience.webglElement;
    this.renderer = this.experience.renderer.instance;
    this.cssArcadeMachineScene = this.experience.cssArcadeMachineScene;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.screenSize = new Vector2(ARCADE_SCREEN_WIDTH, ARCADE_SCREEN_HEIGHT);
    this.model = {};
    this.arcadeMachineMaterial = this.experience.world.baked.model.material2;
    this.audioManager = this.experience.world.audioManager;
    this.setModel();
    this.setArcadeScreen();
  }

  setModel = () => {
    this.model.arcadeMachineModel = this.resources.items.arcadeMachine.scene;
    this.model.arcadeMachineModel.traverse((child) => { if (child.isMesh) child.material = this.arcadeMachineMaterial; });
    this.model.arcadeMachineModel.name = "arcadeMachine";
    this.scene.add(this.model.arcadeMachineModel);
  };

  setArcadeScreen = () => {
    const container = document.createElement("div");
    container.style.width = this.screenSize.width + "px";
    container.style.height = this.screenSize.height + "px";

    const iframe = document.createElement("iframe");
    iframe.src = ARCADE_IFRAME_SRC;
    iframe.style.width = this.screenSize.width + "px";
    iframe.style.height = this.screenSize.height + "px";
    iframe.style.padding = ARCADE_IFRAME_PADDING;
    iframe.style.border = "0px";
    iframe.id = "arcade-screen";
    iframe.setAttribute('allow', 'autoplay; fullscreen; pointer-lock; keyboard');

    container.appendChild(iframe);
    this.iframe = iframe;
    iframe.addEventListener("load", () => { this.iframeWindow = iframe.contentWindow; });

    const css3dobject = new CSS3DObject(container);
    css3dobject.scale.copy(ARCADE_CSS_OBJECT_SCALE);
    css3dobject.position.copy(ARCADE_CSS_OBJECT_POSITION);
    css3dobject.rotateY(ARCADE_CSS_OBJECT_ROTATION_Y);
    css3dobject.rotateX(ARCADE_CSS_OBJECT_ROTATION_X);
    this.cssArcadeMachineScene.add(css3dobject);

    const materialCRT = new ShaderMaterial({
      blending: NoBlending, side: DoubleSide,
      uniforms: {
        uCurvature: { value: CRT_UNIFORMS.uCurvature },
        uScreenResolution: { value: CRT_UNIFORMS.uScreenResolution },
        uScanLineOpacity: { value: CRT_UNIFORMS.uScanLineOpacity },
        uBaseColor: { value: CRT_UNIFORMS.uBaseColor },
        uColor: { value: CRT_UNIFORMS.uColor },
        uVignetteOpacity: { value: CRT_UNIFORMS.uVignetteOpacity },
        uBrightness: { value: CRT_UNIFORMS.uBrightness },
        uVignetteRoundness: { value: CRT_UNIFORMS.uVignetteOpacity },
      },
      vertexShader, fragmentShader,
    });

    this.model.screen = new Mesh(new PlaneGeometry(this.screenSize.width, this.screenSize.height), materialCRT);
    this.model.screen.position.copy(css3dobject.position);
    this.model.screen.rotation.copy(css3dobject.rotation);
    this.model.screen.scale.copy(css3dobject.scale);
    this.model.screen.name = "arcadeMachineScreen";
    this.model.arcadeMachineModel.add(this.model.screen);
  };

  onMouseMove = () => {
    const isOverArcade = (this.experience.world.navigation?.objectRaycasted?.object?.name === "arcadeMachineScreen");
    if (isOverArcade) {
      this.experience.navigation.orbitControls.enabled = false;
      this.webglElement.style.pointerEvents = "none";
      this.iframe.focus(); 
    } else {
      this.experience.navigation.orbitControls.enabled = true;
      this.webglElement.style.pointerEvents = "auto";
    }
  };

  activateControls = () => {
    window.addEventListener("keydown", this.handleKeyDownParent);
    window.addEventListener("keyup", this.handleKeyUpParent);
    window.addEventListener("pointermove", this.onMouseMove);
    window.addEventListener("message", this.receiveMessage, false);
    
    // Paksa fokus saat layar diklik
    this.webglElement.addEventListener("mousedown", () => {
        if (this.experience.world.navigation?.objectRaycasted?.object?.name === "arcadeMachineScreen") {
            this.iframe.focus();
        }
    });
  };

  handleKeyDownParent = (e) => { if (this.iframeWindow) this.iframeWindow.postMessage({ type: "keyDownParent", key: e.key }, "*"); };
  handleKeyUpParent = (e) => { if (this.iframeWindow) this.iframeWindow.postMessage({ type: "keyUpParent", key: e.key }, "*"); };
  
  receiveMessage = (e) => {
    const audios = ["hit", "tetris", "die", "select1", "select2"];
    if (audios.includes(e.data)) this.audioManager.playSingleAudio(e.data, 1);
  };
}
