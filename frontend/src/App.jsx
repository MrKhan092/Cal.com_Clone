import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import EventTypes from './pages/EventTypes';
import Availability from './pages/Availability';
import Bookings from './pages/Bookings';
import PublicBooking from './pages/PublicBooking';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<Layout />}>
        <Route path="/event-types" element={<EventTypes />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/bookings" element={<Bookings />} />
      </Route>
      <Route path="/:slug" element={<PublicBooking />} />
    </Routes>
  );
}

export default App;
