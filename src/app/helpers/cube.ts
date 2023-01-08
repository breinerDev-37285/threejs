import { BufferGeometry, Material, Mesh } from "three";
import { rotateOptions } from "@interfaces/cube";

export const rotateCube = (
  cube: Mesh<BufferGeometry, Material | Material[]>,
  opt?: rotateOptions
) => {
  cube.rotation.y += opt?.y ?? 0.009;
  cube.rotation.x += opt?.x ?? 0.008;
  cube.rotation.z += opt?.z ?? 0.001;
};
