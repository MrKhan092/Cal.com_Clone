import React, { useEffect, useState } from 'react';
import api from '../api';
import { Calendar, Clock, Mail, Ban } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('Upcoming');

  const fetchBookings = () => { api.get('/bookings').then(({ data }) => setBookings(data)); };
  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try { await api.patch(`/bookings/${id}/cancel`); fetchBookings(); } catch(err) {}
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'Canceled') return b.status === 'cancelled';
    const isPast = new Date(b.date) < new Date(new Date().setHours(0,0,0,0));
    if (filter === 'Past') return b.status !== 'cancelled' && isPast;
    return b.status !== 'cancelled' && !isPast;
  });

  return (
    <div>
      <div className="mb-6">
        <h2>Bookings</h2>
        <p>See upcoming and past events booked through your event type links.</p>
      </div>

      <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
        {['Upcoming', 'Past', 'Canceled'].map(tab => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            style={{ 
              background: filter === tab ? 'var(--border-light)' : 'transparent', 
              border: 'none', 
              color: filter === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: '500', 
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s', 
              padding: '0.4rem 0.8rem',
              fontSize: '0.875rem'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Calendar size={24} /></div>
          <h3 style={{ marginBottom: '0.5rem' }}>No {filter.toLowerCase()} bookings</h3>
          <p style={{ maxWidth: '450px' }}>You have no {filter.toLowerCase()} bookings. As soon as someone books a time with you it will show up here.</p>
        </div>
      ) : (
        <div className="list-container">
          {filteredBookings.map(b => (
            <div key={b.id} className="list-item">
              <div className="flex gap-6">
                <div className="flex-col" style={{ width: '130px' }}>
                  <div className="font-semibold">{format(parseISO(b.date), 'MMM d, yyyy')}</div>
                  <div className="flex items-center gap-1 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    <Clock size={14} /> {b.startTime} - {b.endTime}
                  </div>
                </div>
                <div className="flex-col pl-6" style={{ borderLeft: '1px solid var(--border-light)' }}>
                  <div className="font-semibold flex items-center gap-2">
                    {b.name}
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    <Mail size={14} /> {b.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    <Calendar size={14} /> {b.eventType?.title || 'Unknown Event'}
                  </div>
                </div>
              </div>
              {b.status !== 'cancelled' && (
                <button className="btn" style={{ borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }} onClick={() => cancelBooking(b.id)}>
                  <Ban size={16} /> Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
