import Logo from "./Logo";
/* eslint-disable react/prop-types */
function Navbar({ children }) {
  return (
    <div>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </div>
  );
}

export default Navbar;
