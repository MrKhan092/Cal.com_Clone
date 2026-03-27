import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, isBefore, startOfDay } from 'date-fns';
import { Clock, Calendar, CheckCircle, Video, Globe } from 'lucide-react';

export default function PublicBooking() {
  const { slug } = useParams();
  
  const [eventType, setEventType] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  useEffect(() => {
    api.get('/event-types').then(({ data }) => {
      setEventType(data.find(e => e.slug === slug));
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (selectedDate && eventType) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      api.get(`/availability/slots?date=${dateStr}&eventTypeId=${eventType.id}`)
         .then(({ data }) => setAvailableSlots(data)).catch(() => setAvailableSlots([]));
    }
  }, [selectedDate, eventType]);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', { eventTypeId: eventType.id, name, email, date: format(selectedDate, 'yyyy-MM-dd'), startTime: selectedTime.startTime, endTime: selectedTime.endTime });
      setBookingSuccess(true);
    } catch (err) { alert('Failed to book. Double booking error.'); }
  };

  if (loading) return null;
  if (!eventType) return <div style={{background: 'var(--bg-primary)', height: '100vh'}}><h2 className="p-10 text-center">Event not found</h2></div>;

  if (bookingSuccess) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-10" style={{background: 'var(--bg-primary)'}}>
      <CheckCircle size={56} className="mb-6 text-green-500" style={{color: '#10b981'}} />
      <h2 className="mb-2">Booking Confirmed!</h2>
      <p className="text-secondary mb-8">You are scheduled with us for {eventType.title}.</p>
    </div>
  );

  return (
    <div className="flex items-center pt-12 pb-12" style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', justifyContent: 'center' }}>
      <div className="flex border border-light rounded-lg overflow-hidden fade-in" style={{ borderColor: 'var(--border-light)', borderStyle: 'solid', borderWidth: '1px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-primary)', minHeight: '520px', width: 'max-content', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        
        {/* L1: Event Info */}
        <div style={{ width: '320px', padding: '2.5rem 2rem', borderRight: '1px solid var(--border-light)' }}>
          <div className="flex gap-3 items-center mb-6">
            <img src="https://github.com/nutlope.png" alt="Avatar" style={{width: 28, height: 28, borderRadius: '50%'}} />
            <span className="font-semibold text-secondary text-sm">Mohammed Kaif</span>
          </div>
          <h2 className="text-2xl mb-2 font-bold">{eventType.title}</h2>
          <p className="text-secondary mb-8 text-sm leading-relaxed">{eventType.description || 'Welcome to my scheduling page.'}</p>
          
          <div className="flex flex-col gap-4 font-medium text-secondary text-sm">
            <div className="flex items-center gap-2"><Clock size={16} /> {eventType.duration} min</div>
            <div className="flex items-center gap-2"><Video size={16} /> Cal Video</div>
            <div className="flex items-center gap-2"><Globe size={16} /> Asia/Kolkata</div>
          </div>
        </div>

        {/* L2: Calendar */}
        {!selectedTime ? (
          <>
            <div style={{ flex: selectedDate ? 'none' : 1, width: selectedDate ? '360px' : 'auto', padding: '2.5rem 2rem', borderRight: selectedDate ? '1px solid var(--border-light)' : 'none' }}>
              <h3 className="mb-6 text-lg font-bold">Select a Date</h3>
              <div className="flex" style={{ justifyContent: 'center' }}>
                <DayPicker 
                  mode="single" 
                  selected={selectedDate} 
                  onSelect={setSelectedDate}
                  disabled={(d) => isBefore(d, startOfDay(new Date()))}
                  showOutsideDays={true}
                  style={{ '--rdp-accent-color': '#ffffff', '--rdp-background-color': '#27272a' }}
                  modifiersStyles={{ today: { color: '#ffffff', fontWeight: 'bold' } }}
                />
              </div>
            </div>
            
            {/* L3: Time Slots */}
            {selectedDate && (
              <div style={{ flex: 1, padding: '2.5rem 2rem' }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold">{format(selectedDate, 'E d')}</h3>
                  <div className="text-xs font-semibold px-2 py-1 rounded text-primary" style={{ background: 'var(--border-light)', borderRadius: 'var(--radius-sm)' }}>12h 24h</div>
                </div>
                
                <div className="flex flex-col gap-3" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {availableSlots.map(slot => (
                     <button key={slot.startTime} className="time-slot-pill" onClick={() => setSelectedTime(slot)}>
                      {slot.startTime}
                    </button>
                  ))}
                  {availableSlots.length === 0 && <p className="text-secondary text-sm">No availability</p>}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Form View */
          <div style={{ flex: 1, padding: '3rem 4rem' }}>
            <h3 className="mb-6 text-xl">Enter Details</h3>
            <div className="flex items-center gap-3 mb-8 pb-6 border-b" style={{ borderBottom: '1px solid var(--border-light)' }}>
              <Calendar size={18} className="text-secondary" />
              <div className="font-medium text-lg">{format(selectedDate, 'EEEE, MMMM d')} at {selectedTime.startTime}</div>
            </div>
            
            <form onSubmit={handleBook}>
              <div className="form-group mb-6">
                <label className="form-label">Name</label>
                <input required autoFocus type="text" className="form-input" style={{padding: '0.8rem'}} value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group mb-8">
                <label className="form-label">Email address</label>
                <input required type="email" className="form-input" style={{padding: '0.8rem'}} value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button type="button" className="btn btn-secondary flex-1 py-3" style={{padding: '0.8rem', border: '1px solid var(--border-light)'}} onClick={() => setSelectedTime(null)}>Back</button>
                <button type="submit" className="btn btn-primary flex-1 py-3" style={{padding: '0.8rem', background: 'var(--text-primary)', color: 'var(--bg-primary)'}}>Confirm</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
