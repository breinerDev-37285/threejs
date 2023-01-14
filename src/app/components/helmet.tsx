import Helmet from "@models/helmet";
import { useEffect, useRef } from "react";

export const SpacialHelmet = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const helmet = Helmet.init(element);

    helmet.control();
    helmet.render();
    helmet.updateOnResize();
    helmet.directionalLight(false);
    helmet.ambientLight();
    helmet.hdriLight();
    helmet.loadingManager();
    helmet.plane();
    helmet.loadDracoModel();

    return () => {
      helmet.destroy();
    };
  }, [ref]);
  return (
    <div
      style={{ width: "100%", height: "100vh", overflow: "hidden" }}
      ref={ref}
    />
  );
};
