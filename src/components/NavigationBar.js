import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logoipsum from "../logoipsum.svg";


const NavigationBar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* Left side navigation items */}
      <div className="nav-left">
        <NavLink
          to="/dashboard"
          className={`nav-item ${location.pathname === '/dashboard' ? 'selected' : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/offers"
          className={`nav-item ${location.pathname === '/offers' ? 'selected' : ''}`}
        >
          Offers
        </NavLink>
      </div>

      {/* Right side navigation items */}
      <div className="nav-right">
        <NavLink
          to="/demo"
          className={`nav-item ${location.pathname === '/demo' ? 'selected' : ''}`}
        >
          App Demo
        </NavLink>
        <NavLink
          to="/contact"
          className={`nav-item ${location.pathname === '/contact' ? 'selected' : ''}`}
        >
          Contact Us
        </NavLink>
        <NavLink to="/" className="logo-link">
          <img src={logoipsum} alt="logo" />
        </NavLink>
      </div>
    </nav>
  );
};

export default NavigationBar;
