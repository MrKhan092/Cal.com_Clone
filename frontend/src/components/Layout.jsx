import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Calendar, Clock, List, LayoutDashboard } from 'lucide-react';

const Layout = () => {
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Calendar size={24} color="var(--brand-primary)" />
          <span>Cal.com Clone</span>
        </div>
        <nav className="sidebar-nav mt-6">
          <NavLink to="/event-types" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <List size={20} /> Event Types
          </NavLink>
          <NavLink to="/availability" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Clock size={20} /> Availability
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Bookings
          </NavLink>
        </nav>
      </aside>
      <main className="main-content fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
