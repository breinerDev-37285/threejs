import ControlCube from "@controls/cube";
import Cube from "@models/cube";
import { useEffect, useRef } from "react";

export const CubeComponent = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ref = sceneRef.current;
    if (!ref) return;
    const cube = new Cube(ref);
    cube.drawCube();
    cube.control();
    cube.render();
    cube.updateOnResize();

    if (!cube.Layer) return;
    const controls = new ControlCube(cube?.Layer);
    controls.controlPosition();
    controls.controlScale();
    controls.controlColor();
    controls.controlRotation();

    return () => {
      cube.destroy();
      controls.destroy();
    };
  }, [sceneRef, Cube]);

  return (
    <div
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      ref={sceneRef}
    />
  );
};
