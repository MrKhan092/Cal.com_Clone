import React, { useEffect, useState } from 'react';
import api from '../api';
import { Calendar, Clock, User, Mail, Ban } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    api.get('/bookings').then(({ data }) => {
      setBookings(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings();
    } catch(err) { alert('Failed to cancel'); }
  };

  if (loading) return <div className="skeleton" style={{ height: '300px' }}></div>;

  return (
    <div>
      <h2 className="mb-6">Bookings</h2>
      <div className="fade-in">
        {bookings.length === 0 ? (
          <div className="card text-center py-10"><p>No bookings yet.</p></div>
        ) : bookings.map(b => (
          <div key={b.id} className="card flex items-center justify-between mb-4">
            <div className="flex gap-6">
              <div className="flex-col" style={{ width: '130px' }}>
                <div className="font-bold text-lg">{format(parseISO(b.date), 'MMM d, yyyy')}</div>
                <div className="flex items-center gap-1 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  <Clock size={14} /> {b.startTime} - {b.endTime}
                </div>
              </div>
              <div className="flex-col pl-6" style={{ borderLeft: '1px solid var(--border-light)' }}>
                <div className="font-medium text-lg flex items-center gap-2">
                  <span style={{ color: 'var(--text-primary)' }}>{b.name}</span>
                  {b.status === 'cancelled' && <span className="badge badge-gray">Cancelled</span>}
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
              <button className="btn btn-danger" onClick={() => cancelBooking(b.id)}>
                <Ban size={16} /> Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
