import {
  Color,
  WebGLRenderer,
  Vector2,
  WebGLRenderTarget,
  LinearFilter,
} from "three";
import Experience from "./Experience.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.webglElement = this.experience.webglElement;
    this.cssArcadeMachine = this.experience.cssArcadeMachine;
    this.cssLeftMonitor = this.experience.cssLeftMonitor;
    this.cssRightMonitor = this.experience.cssRightMonitor;
    this.config = this.experience.config;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.cssArcadeMachineScene = this.experience.cssArcadeMachineScene;
    this.cssLeftMonitorScene = this.experience.cssLeftMonitorScene;
    this.cssRightMonitorScene = this.experience.cssRightMonitorScene;

    this.usePostprocess = true;

    this.setInstance();
    this.setPostProcess();
  }

  setInstance() {
    // 🌌 Background UNGU GELAP
    this.clearColor = new Color("#1a1026").convertSRGBToLinear();

    this.instance = new WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });

    this.instance.setClearColor(this.clearColor, 1);
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);
    this.instance.outputColorSpace = "srgb";
    this.instance.localClippingEnabled = true;

    this.webglElement.appendChild(this.instance.domElement);

    // CSS 3D
    this.cssArcadeMachineInstance = new CSS3DRenderer();
    this.cssArcadeMachineInstance.setSize(this.sizes.width, this.sizes.height);

    this.cssLeftMonitorInstance = new CSS3DRenderer();
    this.cssLeftMonitorInstance.setSize(this.sizes.width, this.sizes.height);

    this.cssRightMonitorInstance = new CSS3DRenderer();
    this.cssRightMonitorInstance.setSize(this.sizes.width, this.sizes.height);

    this.cssArcadeMachine.appendChild(
      this.cssArcadeMachineInstance.domElement
    );
    this.cssLeftMonitor.appendChild(this.cssLeftMonitorInstance.domElement);
    this.cssRightMonitor.appendChild(this.cssRightMonitorInstance.domElement);
  }

  setPostProcess() {
    this.postProcess = {};

    this.postProcess.renderPass = new RenderPass(
      this.scene,
      this.camera.instance
    );

    this.postProcess.outlinePass = new OutlinePass(
      new Vector2(this.config.width, this.config.height),
      this.scene,
      this.camera.instance
    );

    this.postProcess.outlinePass.visibleEdgeColor.set("#ffffff");
    this.postProcess.outlinePass.hiddenEdgeColor.set("#ffffff");
    this.postProcess.outlinePass.edgeThickness = 3;
    this.postProcess.outlinePass.edgeStrength = 6;

    this.renderTarget = new WebGLRenderTarget(
      this.config.width,
      this.config.height,
      {
        samples: this.instance.getPixelRatio() >= 2 ? 8 : 4,
        minFilter: LinearFilter,
        magFilter: LinearFilter,
      }
    );

    this.postProcess.composer = new EffectComposer(
      this.instance,
      this.renderTarget
    );

    this.postProcess.composer.addPass(this.postProcess.renderPass);
    this.postProcess.composer.addPass(this.postProcess.outlinePass);
    this.postProcess.composer.addPass(
      new ShaderPass(GammaCorrectionShader)
    );

    if (this.instance.capabilities.isWebGL2) {
      this.postProcess.composer.addPass(new SMAAPass());
    }
  }

  resize() {
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);
    this.postProcess.composer.setSize(
      this.config.width,
      this.config.height
    );
  }

  update() {
    this.usePostprocess
      ? this.postProcess.composer.render()
      : this.instance.render(this.scene, this.camera.instance);

    this.cssArcadeMachineInstance.render(
      this.cssArcadeMachineScene,
      this.camera.instance
    );
    this.cssLeftMonitorInstance.render(
      this.cssLeftMonitorScene,
      this.camera.instance
    );
    this.cssRightMonitorInstance.render(
      this.cssRightMonitorScene,
      this.camera.instance
    );
  }

  destroy() {
    this.instance.dispose();
    this.renderTarget.dispose();
  }
}
