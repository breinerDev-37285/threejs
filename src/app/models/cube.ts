import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera, BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import MainScene from "./scene";

export default class Cube extends MainScene {
  private readonly camera: PerspectiveCamera;
  private cube?: Mesh;
  private controls?: OrbitControls;

  constructor(ref: HTMLElement) {
    super(ref);

    this.camera = new PerspectiveCamera(
      25,
      this.element.clientWidth / this.element.clientHeight,
      0.1,
      1000
    );

    this.cube = undefined;
    this.controls = undefined;
  }

  public control() {
    /**
     * Permite controlar la cámara en la escena
     */
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  public drawCube() {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ wireframe: true });
    this.cube = new Mesh(geometry, material);
    this.camera.position.set(0, 0, -10);
    this.cube.rotation.set(-0.285, 0.461, 0.02);
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

  public destroy() {
    this.scene.remove();
    this.element.removeChild(this.renderer.domElement);
  }

  get Layer() {
    return this.cube;
  }
}
