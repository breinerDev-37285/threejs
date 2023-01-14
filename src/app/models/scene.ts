import { Scene, WebGLRenderer } from "three";

export default abstract class MainScene {
  protected readonly scene: Scene;
  protected readonly renderer: WebGLRenderer;
  protected element: HTMLElement;

  constructor(ref: HTMLElement) {
    this.element = ref;
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.element.clientWidth, this.element.clientHeight);
    this.element.appendChild(this.renderer.domElement);
  }

  get Scene(): Scene {
    return this.scene;
  }

  get Renderer(): WebGLRenderer {
    return this.renderer;
  }

  get Element(): HTMLElement {
    return this.element;
  }


  public abstract render(): void;
}
