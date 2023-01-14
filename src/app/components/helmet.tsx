import Helmet from "@models/helmet";
import { useEffect, useRef } from "react";

export const SpacialHelmet = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const helmet = Helmet.init(element);
    helmet.loadDracoModel();
    helmet.control();
    helmet.render();
    helmet.updateOnResize();
    helmet.directionalLight();
    helmet.ambientLight();
    helmet.hdriLight();
    helmet.loadingManager();

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
