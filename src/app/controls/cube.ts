import { cubeAuxControlOptions } from "@interfaces/cube";
import { GUI } from "dat.gui";
import { Mesh, BufferGeometry, Material, Scene, BoxGeometry } from "three";

export default class ControlCube {
  private readonly gui: GUI;
  private readonly cube: Mesh<BufferGeometry, Material | Material[]>;
  private auxControl: cubeAuxControlOptions;

  constructor(cube: Mesh<BufferGeometry, Material | Material[]>) {
    this.gui = new GUI();
    this.cube = cube;
    this.auxControl = {
      scale: 1,
      rotation: 0.001,
      color: 0xffffff,
    };
  }

  public controlPosition(min?: number, max?: number, step?: number) {
    const position = this.gui.addFolder("Position");
    position
      ?.add(this.cube.position, "x")
      .min(min ?? -10)
      .max(max ?? 10)
      .step(step ?? 0.01)
      .name("Pos X");
    position
      ?.add(this.cube.position, "y")
      .min(min ?? -10)
      .max(max ?? 10)
      .step(step ?? 0.01)
      .name("Pos Y");
    position
      ?.add(this.cube.position, "z")
      .min(min ?? -10)
      .max(max ?? 10)
      .step(step ?? 0.01)
      .name("Pos Z");
  }

  public controlScale() {
    const scale = this.gui.addFolder("Scale");
    scale
      .add(this?.auxControl, "scale", {
        small: 1,
        medium: 2,
        large: 3,
      })
      .name("Scale X")
      .onChange((scale) => {
        this.cube.scale.set(scale, scale, scale);
      });
  }

  public controlRotation() {
    const rotation = this.gui.addFolder("Rotation");
    rotation
      .add(this.cube.rotation, "x")
      .min(-1)
      .max(1)
      .step(0.0001)
      .name("Rot x");
    rotation
      .add(this.cube.rotation, "y")
      .min(-1)
      .max(1)
      .step(0.0001)
      .name("Rot y");
    rotation
      .add(this.cube.rotation, "z")
      .min(-1)
      .max(1)
      .step(0.0001)
      .name("Rot z");
  }

  public controlColor() {
    const colors = this.gui.addFolder("Color");
    colors
      .addColor(this.auxControl, "color")
      .name("Color")
      .onChange((color) => {
        (this.cube.material as any).color.set(color);
      });
  }

  public destroy() {
    this.gui.destroy();
  }
}
