import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <ul>
      <li>
        <Link to="/cube">Cube</Link>
      </li>
      <li>
        <Link to="/ufo">UFO</Link>
      </li>
      <li>
        <Link to="/spacial-helmet">helmet</Link>
      </li>
    </ul>
  );
};

export default Navigation;
