import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <Link to="/">
          <h1 className="text-2xl font-bold text-gray-800">CRM</h1>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;