import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
} from "three";

export default class Cube {
  private readonly scene: Scene;
  private readonly camera: PerspectiveCamera;
  private readonly renderer: WebGLRenderer;
  private readonly element: HTMLElement;
  private cube?: Mesh;
  private controls?: OrbitControls;

  constructor(ref: HTMLElement) {
    this.element = ref;
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      25,
      this.element.clientWidth / this.element.clientHeight,
      0.1,
      1000
    );
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);
    this.element.appendChild(this.renderer.domElement);
    this.cube = undefined;
    this.controls = undefined;
  }

  public destroy() {
    this.scene.remove();
    this.element.removeChild(this.renderer.domElement);
  }

  public control() {
    /**
     * Permite controlar la cámara en la escena
     */
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  public drawCube() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshNormalMaterial({ flatShading: true });
    this.cube = new Mesh(geometry, material);
    this.camera.position.set(0, 0, -10);
    this.controls?.update();
    this.scene.add(this.cube);
  }

  public render(callback?: () => void) {
    const animate = () => {
      callback?.();
      requestAnimationFrame(animate);
      this.controls?.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
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

  get Layer() {
    return this.cube;
  }
}
