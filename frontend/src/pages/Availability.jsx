import React, { useEffect, useState } from 'react';
import api from '../api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Availability() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/availability').then(({ data }) => {
      if (data.length === 0) {
        setSchedule([1,2,3,4,5].map(d => ({ dayOfWeek: d, startTime: '09:00', endTime: '17:00' })));
      } else {
        setSchedule(data);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/availability', schedule);
      alert('Availability saved successfully!');
    } catch(err) {
      alert('Failed to save availability');
    }
  };

  const toggleDay = (dayIndex) => {
    if (schedule.find(s => s.dayOfWeek === dayIndex)) {
      setSchedule(schedule.filter(s => s.dayOfWeek !== dayIndex));
    } else {
      const newSchedule = [...schedule, { dayOfWeek: dayIndex, startTime: '09:00', endTime: '17:00' }];
      setSchedule(newSchedule.sort((a,b) => a.dayOfWeek - b.dayOfWeek));
    }
  };

  const updateTime = (dayIndex, field, value) => {
    setSchedule(schedule.map(s => s.dayOfWeek === dayIndex ? { ...s, [field]: value } : s));
  };

  if (loading) return <div className="skeleton" style={{ height: '300px', width: '100%' }}></div>;

  return (
    <div className="card fade-in" style={{ maxWidth: '700px' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2>Availability</h2>
          <p>Set your weekly hours when people can book you.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>Save</button>
      </div>

      <div className="flex-col gap-4 mt-6">
        {DAYS.map((day, idx) => {
          const slot = schedule.find(s => s.dayOfWeek === idx);
          return (
            <div key={idx} className="flex items-center justify-between py-4 border-b border-light" style={{ borderBottomColor: 'var(--border-light)' }}>
              <div className="flex items-center gap-4" style={{ width: '160px' }}>
                <input type="checkbox" checked={!!slot} onChange={() => toggleDay(idx)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                <span className={slot ? 'font-medium' : 'text-secondary'} style={{ color: slot ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{day}</span>
              </div>
              
              {slot ? (
                <div className="flex items-center gap-4">
                  <input type="time" className="form-input py-1 px-2" style={{ padding: '0.3rem 0.6rem' }} value={slot.startTime} onChange={e => updateTime(idx, 'startTime', e.target.value)} />
                  <span className="text-secondary">-</span>
                  <input type="time" className="form-input py-1 px-2" style={{ padding: '0.3rem 0.6rem' }} value={slot.endTime} onChange={e => updateTime(idx, 'endTime', e.target.value)} />
                </div>
              ) : (
                <div className="text-sm text-secondary">Unavailable</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
