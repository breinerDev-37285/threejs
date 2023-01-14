import { PerspectiveCamera, AmbientLight } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import MainScene from "./scene";

export default class UFOScene extends MainScene {
  private readonly camera: PerspectiveCamera;
  private gftLoader?: GLTFLoader;

  constructor(ref: HTMLElement) {
    super(ref);
    this.camera = new PerspectiveCamera(
      25,
      this.element.clientWidth / this.element.clientHeight,
      0.1,
      1000
    );
    this.gftLoader = new GLTFLoader();
  }

  static init(ref: HTMLElement) {
    return new UFOScene(ref);
  }

  public destroy() {
    this.scene.remove();
    this.element.removeChild(this.renderer.domElement);
  }

  public render() {
    this.Renderer.render(this.Scene, this.camera);
  }

  public updateOnResize() {
    const resize = () => {
      this.renderer.setSize(
        this.element.clientWidth,
        this.element.clientHeight
      );
      this.camera.aspect = this.element.clientWidth / this.element.clientHeight;
      this.camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
  }

  public drawLayer() {
    this.gftLoader?.load(
      "./models/ufo/scene.gltf",
      (gltfUfo) => {
        this.Scene.add(gltfUfo.scene);
        const light = new AmbientLight(0xffffff, 1);
        this.Scene.add(light);
        console.log(gltfUfo.scene);
      },
      () => {
        console.log("loading");
      },
      console.error
    );
  }
}
