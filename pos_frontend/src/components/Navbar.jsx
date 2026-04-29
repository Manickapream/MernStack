import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

function Navbar({ theme = "light" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleNav = (path, sectionId) => {
    setIsMobileOpen(false);

    if (sectionId && location.pathname === '/') {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    navigate(path);
  };

  return (
    <header className={`global-navbar ${theme}`}>
      <div className="global-logo" onClick={() => navigate('/login')} title="Admin Login">
        VS Tech Manufacturing Solutions
      </div>

      <nav className={`global-nav-links ${isMobileOpen ? 'open' : ''}`}>
        <a onClick={() => handleNav('/', 'top')}>Home</a>
        <a onClick={() => handleNav('/products', 'products')}>Products</a>
        <a onClick={() => handleNav('/services', 'services')}>Services</a>
        <a onClick={() => handleNav('/about', 'about')}>About</a>
        <a onClick={() => handleNav('/contact', 'contact')}>Contact</a>
        <button className="global-nav-btn" onClick={() => handleNav('/book')}>Book Now</button>
      </nav>

      <div className="mobile-menu-icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
      </div>
    </header>
  );
}

export default Navbar;
