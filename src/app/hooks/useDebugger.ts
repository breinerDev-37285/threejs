import { useEffect } from "react";
import { GUI } from "dat.gui";

const useDebugger = (obj3D: Record<string, any>) => {
  useEffect(() => {
    const gui = new GUI();
    gui.add(obj3D, "cubos").min(1).max(10).step(1).name("No. cubos");
    gui
      .add(obj3D.spheres.green, "big")
      .name("big red sphere")
      .min(1)
      .max(4)
      .step(1);

    console.log(gui);

    return () => {
      gui.destroy();
    };
  }, []);

  return {};
};

export default useDebugger;
