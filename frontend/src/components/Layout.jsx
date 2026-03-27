import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Link, Calendar, Clock, LayoutDashboard } from 'lucide-react';

const Layout = () => {
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="https://github.com/nutlope.png" alt="Avatar" style={{width: 20, height: 20, borderRadius: '50%'}} />
          <span>Mohammad Kaif</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/event-types" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
             <Link size={16} /> Event types
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Calendar size={16} /> Bookings
          </NavLink>
          <NavLink to="/availability" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Clock size={16} /> Availability
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
