import { useRef, useEffect } from "react";
import UFOmodel from "@models/ufo";

export const UFOComponent = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const ufo = UFOmodel.init(element);
    ufo.render();
    ufo.drawLayer();
    ufo.updateOnResize();

    return () => {
      ufo.destroy();
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100vh", overflow: "hidden" }}
    />
  );
};
