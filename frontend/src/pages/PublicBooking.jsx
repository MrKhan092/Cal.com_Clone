import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, isBefore, startOfDay } from 'date-fns';
import { Clock, Calendar, CheckCircle } from 'lucide-react';

export default function PublicBooking() {
  const { slug } = useParams();
  
  const [eventType, setEventType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  useEffect(() => {
    api.get('/event-types').then(({ data }) => {
      const et = data.find(e => e.slug === slug);
      if (!et) setError('Event type not found.');
      else setEventType(et);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (selectedDate && eventType) {
      setLoadingSlots(true);
      setSelectedTime(null);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      api.get(`/availability/slots?date=${dateStr}&eventTypeId=${eventType.id}`)
        .then(({ data }) => {
          setAvailableSlots(data);
          setLoadingSlots(false);
        })
        .catch(() => {
           setAvailableSlots([]);
           setLoadingSlots(false);
        });
    }
  }, [selectedDate, eventType]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !name || !email) return;
    
    try {
      await api.post('/bookings', {
        eventTypeId: eventType.id,
        name,
        email,
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: selectedTime.startTime,
        endTime: selectedTime.endTime
      });
      setBookingSuccess(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to book slot.');
    }
  };

  if (loading) return <div className="public-booking-container"><div className="skeleton" style={{ width: '800px', height: '500px' }}></div></div>;
  if (error || !eventType) return <div className="public-booking-container"><h2>{error || 'Not Found'}</h2></div>;

  if (bookingSuccess) {
    return (
      <div className="public-booking-container">
        <div className="public-booking-card p-10 flex flex-col items-center justify-center text-center fade-in" style={{ padding: '4rem 2rem' }}>
          <CheckCircle size={56} style={{ color: 'var(--success-color)' }} className="mb-6" />
          <h2 className="mb-2">Booking Confirmed!</h2>
          <p className="text-secondary mb-8">You are scheduled with us for {eventType.title}.</p>
          <div className="card text-left flex justify-between items-center" style={{ width: '100%', maxWidth: '400px', border: '1px solid var(--border-light)' }}>
            <div>
              <div className="font-semibold">{name}</div>
              <div className="text-secondary text-sm">{email}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-sm font-medium">
                <Calendar size={14} /> {format(selectedDate, 'MMM d, yyyy')}
              </div>
              <div className="flex items-center justify-end gap-2 mt-1 text-sm text-secondary">
                <Clock size={14} /> {selectedTime.startTime} - {selectedTime.endTime}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-booking-container fade-in">
      <div className="public-booking-card">
        <div className="public-booking-left">
          <div className="text-secondary font-medium text-sm tracking-wide mb-2 uppercase">Cal.com Clone</div>
          <h2 className="mb-2 text-2xl" autoFocus tabIndex={0}>{eventType.title}</h2>
          <div className="flex items-center gap-2 mb-4 text-secondary font-medium">
            <Clock size={16} /> {eventType.duration} min
          </div>
          <p className="text-secondary mb-6 leading-relaxed" style={{ fontSize: '0.95rem' }}>
            {eventType.description || 'Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.'}
          </p>
          
          {selectedDate && selectedTime && (
            <div className="mt-8 pt-6 border-t border-light fade-in" style={{ borderTopColor: 'var(--border-light)' }}>
              <div className="font-medium mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Calendar size={16} /> {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                <Clock size={16} /> {selectedTime.startTime} - {selectedTime.endTime}
              </div>
            </div>
          )}
        </div>
        
        <div className="public-booking-right">
          {!selectedTime ? (
            <div className="flex" style={{ gap: '2.5rem' }}>
              <div>
                <h3 className="mb-4">Select a Date</h3>
                <div style={{ transform: 'scale(1.05)', transformOrigin: 'top left' }}>
                  <DayPicker 
                    mode="single" 
                    selected={selectedDate} 
                    onSelect={setSelectedDate}
                    disabled={(d) => isBefore(d, startOfDay(new Date()))}
                    showOutsideDays={true}
                  />
                </div>
              </div>
              
              {selectedDate && (
                <div className="fade-in" style={{ flex: 1 }}>
                  <h3 className="mb-4 font-medium" style={{ color: 'var(--text-primary)' }}>{format(selectedDate, 'EEEE, MMMM d')}</h3>
                  {loadingSlots ? (
                    <div className="skeleton" style={{ height: '300px', width: '100%' }}></div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-secondary mt-10 text-center">No slots available on this date.</p>
                  ) : (
                    <div className="time-grid">
                      {availableSlots.map(slot => (
                        <button 
                          key={slot.startTime} 
                          className="time-slot" 
                          onClick={() => setSelectedTime(slot)}
                        >
                          {slot.startTime}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="fade-in" style={{ maxWidth: '420px', margin: '0 auto' }}>
              <h3 className="mb-6">Enter Details</h3>
              <form onSubmit={handleBook}>
                <div className="form-group mb-4">
                  <label className="form-label">Name *</label>
                  <input required autoFocus type="text" className="form-input" style={{ padding: '0.75rem' }} value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="form-group mb-8">
                  <label className="form-label">Email *</label>
                  <input required type="email" className="form-input" style={{ padding: '0.75rem' }} value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
                </div>
                
                <div className="flex gap-4">
                  <button type="button" className="btn btn-secondary flex-1 py-3" onClick={() => setSelectedTime(null)}>Back</button>
                  <button type="submit" className="btn btn-primary flex-1 py-3">Confirm Booking</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
