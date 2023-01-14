import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import {
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  LoadingManager,
  CubeTextureLoader,
  Mesh,
} from "three";
import MainScene from "./scene";
import { GUI } from "dat.gui";

export default class Helmet extends MainScene {
  private readonly camera: PerspectiveCamera;
  private controls?: OrbitControls;
  private loader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private loadingLoader: LoadingManager;
  private gui: GUI;
  private lightsFolder?: GUI;
  private showControls: boolean;

  private constructor(ref: HTMLElement) {
    super(ref);

    this.camera = new PerspectiveCamera(
      25,
      this.element.clientWidth / this.element.clientHeight,
      0.1,
      1000
    );

    this.controls = undefined;
    this.loadingLoader = new LoadingManager();
    this.loader = new GLTFLoader(this.loadingLoader);
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("three/examples/js/libs/draco/");
    this.gui = new GUI();
    this.showControls = true;

    this.showControls
      ? (this.lightsFolder = this.gui.addFolder("Lights"))
      : undefined;
  }

  static init(ref: HTMLElement) {
    return new Helmet(ref);
  }

  /**
   * Control de escena
   */

  public control() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  /**
   * Load GLTF models
   */

  private loadBaseModel(
    path: string,
    onLoad: (gltf: any) => void,
    onProgress?: () => void,
    onError?: (error: any) => void
  ) {
    this.loader.load(path, onLoad, onProgress, onError);
    return this.loader;
  }

  public loadModel() {
    this.loadBaseModel("./space_helmet/scene.gltf", (gltf) => {
      this.scene.add(gltf.scene);
      this.camera.position.set(0, 0, -8);
      this.controls?.update();
    });
  }

  public loadDracoModel() {
    /*
     * El modelo de Draco usa archivos gltf comprimidos para mejorar
     * el rendimiento, demora mas tiempo en cargar pero es mas rápido en ejecución
     */
    const loader = this.loadBaseModel(
      "./space_helmet/draco/helmet.gltf",
      (gltf) => {
        this.scene.add(gltf.scene);
        this.camera.position.set(0, 0, -8);
        this.controls?.update();
      }
    );
    loader.setDRACOLoader(this.dracoLoader);
  }

  public loadingManager() {
    this.loadingLoader.onProgress = (url, itemsLoaded, itemsTotal) => {
      const percent = (itemsLoaded / itemsTotal) * 100;
      console.log(`${percent.toFixed(2)}% loaded`);
    };

    this.loadingLoader.onLoad = () => {
      console.log("Loading complete!");
    };

    this.loadingLoader.onError = (url) => {
      console.log(`There was an error loading ${url}`);
    };
  }

  /**
   * Lights
   */

  public directionalLight() {
    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    light.castShadow = true; // agrega una sombra a esta luz
    this.scene.add(light);

    this.lightsFolder
      ?.add(light, "intensity")
      .min(0.5)
      .max(10)
      .step(0.001)
      .name("Directional");
  }

  public ambientLight() {
    const light = new AmbientLight(0xffffff, 1);
    this.scene.add(light);

    this.lightsFolder
      ?.add(light, "intensity")
      .min(0.5)
      .max(10)
      .step(0.001)
      .name("Ambient");
  }

  public hdriLight() {
    const baseUrl = "./space_helmet/envmap";
    const envMap = new CubeTextureLoader().load([
      `${baseUrl}/px.png`,
      `${baseUrl}/py.png`,
      `${baseUrl}/pz.png`,
      `${baseUrl}/nx.png`,
      `${baseUrl}/nx.png`,
      `${baseUrl}/nx.png`,
    ]);

    this.scene.environment = envMap;

    /**
     * Para luces HDRI se modifica la intensidad de luz
     * que tiene el material de la malla
     */
    const lightParams = {
      intensity: 1,
    };

    this.lightsFolder
      ?.add(lightParams, "intensity")
      .min(0.5)
      .max(10)
      .step(0.001)
      .name("HDRI")
      .onChange((value) => {
        this.scene.traverse((child) => {
          /**
           * Tambien se puede comprobar por la malla y el material
           * if(child instanceof Mesh && child.material instanceof MeshStandardMaterial)
           */
          if (child instanceof Mesh) {
            child.material.envMapIntensity = value;
          }
        });
      });
  }

  /**
   * Renderer
   */

  public render() {
    this.renderer.shadowMap.enabled = true; //Habilita las sombras
    const animate = () => {
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
    this.gui.destroy();
    this.element.removeChild(this.renderer.domElement);
  }

  set ShowControls(value: boolean) {
    this.showControls = value;
  }
}
