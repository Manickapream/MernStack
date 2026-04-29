import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

function Navbar({ theme = "light" }) {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <header className={`global-navbar ${theme}`}>
      <div className="global-logo" onClick={() => navigate('/login')} title="Admin Login">
        VS Tech Manufacturing Solutions
      </div>

      <nav className={`global-nav-links ${isMobileOpen ? 'open' : ''}`}>
        <a onClick={() => handleNav('/')}>Home</a>
        <a onClick={() => handleNav('/products')}>Products</a>
        <a onClick={() => handleNav('/services')}>Services</a>
        <a onClick={() => handleNav('/about')}>About</a>
        <a onClick={() => handleNav('/contact')}>Contact</a>
        <button className="global-nav-btn" onClick={() => handleNav('/book')}>Book Now</button>
      </nav>

      <div className="mobile-menu-icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
      </div>
    </header>
  );
}

export default Navbar;
