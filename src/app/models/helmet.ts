import MainScene from "./scene";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  LoadingManager,
  CubeTextureLoader,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
  CameraHelper,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  CineonToneMapping,
  sRGBEncoding,
} from "three";

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
   * Control orbital de escena
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
      gltf.castShadow = true;
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
        gltf.scene.rotation.y = Math.PI * 3;
        this.scene.add(gltf.scene);
        this.camera.position.set(10, 7, -8);
        this.controls?.update();

        /**
         * Aplica sombra a todas las mallas
         */
        this.scene.traverse((child) => {
          if (child instanceof Mesh) {
            child.castShadow = true;
          }
        });
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

  private drawHelperLight(light: any) {
    /** Dibuja lineas guias
     * para ver el area que proyecta la luz
     */
    light.shadow.camera.zoom = 2;
    const helper = new CameraHelper(light.shadow.camera);
    this.scene.add(helper);
  }

  public directionalLight(drawHelper = false) {
    const light = new DirectionalLight(0xab2020, 2);
    light.position.set(3, 10, 5);
    light.castShadow = true; // agrega una sombra a esta luz
    light.shadow.mapSize.set(1024, 1024); // tamaño de la sombra
    light.shadow.bias = 0.005; // ajusta la sombra
    light.shadow.normalBias = 0.005; // ajusta la sombra
    this.scene.add(light);

    if (drawHelper) this.drawHelperLight(light);

    this.lightsFolder
      ?.add(light, "intensity")
      .min(0.5)
      .max(10)
      .step(0.001)
      .name("Directional");
  }

  public ambientLight() {
    const light = new AmbientLight(0xffffff, 0.706);
    this.scene.add(light);

    this.lightsFolder
      ?.add(light, "intensity")
      .min(0)
      .max(1)
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
           * También se puede comprobar por la malla y el material
           * if(child instanceof Mesh && child.material instanceof MeshStandardMaterial)
           */
          if (child instanceof Mesh) {
            child.material.envMapIntensity = value;
          }
        });
      });
  }

  /**
   * Planos y sombras
   * (Para habilitar las sombras se debe habilitar en el render y en la luz)
   * se recomienda que la sombra sola se aplique a una luz especifica y no a todas
   */

  public plane() {
    const geometry = new PlaneGeometry(10, 10);
    const material = new MeshStandardMaterial({ color: 0xffffff });
    const plane = new Mesh(geometry, material);

    plane.rotation.x = Math.PI * -0.5;
    plane.position.y = -1.3;
    plane.receiveShadow = true;

    this.scene.add(plane);
  }

  private renderShadow() {
    this.renderer.shadowMap.enabled = true; //Habilita las sombras
    this.renderer.shadowMap.type = PCFSoftShadowMap; //Tipo de sombra
    this.renderer.physicallyCorrectLights = true; //Habilita las luces físicas
  }

  private toneMapping() {
    /**
     * Renderizado tono de colores
     */

    this.renderer.outputEncoding = sRGBEncoding; //Habilita el tono de colores sRGB

    this.renderer.toneMapping = ACESFilmicToneMapping; //ACESFilmic
    this.renderer.toneMappingExposure = 0.7; //Exposición

    const tone = this.gui.addFolder("Tonos de color");
    tone
      .add(this.renderer, "toneMapping", {
        "Sin tono": NoToneMapping,
        Linear: LinearToneMapping,
        Renhard: ReinhardToneMapping,
        Cineon: CineonToneMapping,
        ACESFilmic: ACESFilmicToneMapping,
      })
      .onChange((val) => {
        this.renderer.toneMapping = Number(this.renderer.toneMapping);

        /**
         * Actualizar el material en cada cambio de tono
         */
        this.scene.traverse((child) => {
          if (child instanceof Mesh) {
            child.material.needsUpdate = true;
          }
        });
      })
      .name("tipo");

    tone
      .add(this.renderer, "toneMappingExposure")
      .min(0)
      .max(10)
      .step(0.001)
      .name("Exposición");
  }

  /**
   * Renderer
   */

  public render() {
    this.renderShadow();
    this.toneMapping();

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
