import { Route, Routes, BrowserRouter } from "react-router-dom";
import {
  Welcome,
  CubeComponent,
  UFOComponent,
  SpacialHelmet,
} from "@components/index";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="/cube" element={<CubeComponent />} />
        <Route path="/ufo" element={<UFOComponent />} />
        <Route path="/spacial-helmet" element={<SpacialHelmet />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
