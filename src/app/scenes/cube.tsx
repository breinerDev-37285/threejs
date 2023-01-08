import { useEffect, useRef } from "react";
import Cube from "@models/cube";

export const CubeScene = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ref = sceneRef.current;
    if (!ref) return;
    const cube = new Cube(ref);
    cube.drawCube();
    cube.control();
    cube.render(() => {
      if (cube.Layer) {
        cube.Layer.rotation.y += 0.009;
        cube.Layer.rotation.x += 0.008;
        cube.Layer.rotation.z += 0.001;
      }
    });
    cube.updateOnResize();

    return () => cube.destroy();
  }, [sceneRef, Cube]);

  return (
    <div
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      ref={sceneRef}
    />
  );
};
