import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>CAMS</h2>

      <div>
        <Link to="/dashboard">Dashboard</Link>
        {" | "}
        <Link to="/assets">Assets</Link>
        {" | "}
        <Link to="/requests">Requests</Link>
        {" | "}
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar;