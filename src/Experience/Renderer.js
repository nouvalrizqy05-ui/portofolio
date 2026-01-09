setInstance() {
  // Renderer
  this.clearColor = new Color("#1a1026").convertSRGBToLinear();

  this.instance = new WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });

  this.instance.domElement.style.position = "absolute";
  this.instance.domElement.style.top = 0;
  this.instance.domElement.style.left = 0;
  this.instance.domElement.style.width = "100%";
  this.instance.domElement.style.height = "100%";

  this.instance.setClearColor(this.clearColor, 1);
  this.instance.setSize(this.config.width, this.config.height);
  this.instance.setPixelRatio(this.config.pixelRatio);
  this.instance.localClippingEnabled = true;
  this.instance.outputColorSpace = "srgb";

  this.webglElement.appendChild(this.instance.domElement);

  // CSS 3D renderers (AMAN – JANGAN DIUBAH)
  this.cssArcadeMachineInstance = new CSS3DRenderer();
  this.cssArcadeMachineInstance.setSize(this.sizes.width, this.sizes.height);
  this.cssArcadeMachineInstance.domElement.style.position = "absolute";
  this.cssArcadeMachineInstance.domElement.style.top = "0px";

  this.cssLeftMonitorInstance = new CSS3DRenderer();
  this.cssLeftMonitorInstance.setSize(this.sizes.width, this.sizes.height);
  this.cssLeftMonitorInstance.domElement.style.position = "absolute";
  this.cssLeftMonitorInstance.domElement.style.top = "0px";

  this.cssRightMonitorInstance = new CSS3DRenderer();
  this.cssRightMonitorInstance.setSize(this.sizes.width, this.sizes.height);
  this.cssRightMonitorInstance.domElement.style.position = "absolute";
  this.cssRightMonitorInstance.domElement.style.top = "0px";

  this.cssArcadeMachine.appendChild(this.cssArcadeMachineInstance.domElement);
  this.cssLeftMonitor.appendChild(this.cssLeftMonitorInstance.domElement);
  this.cssRightMonitor.appendChild(this.cssRightMonitorInstance.domElement);
}
