import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Link, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'Inter, sans-serif', color: '#111111' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 3rem', background: '#ffffff',
        borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="#111111" />
          <span style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Cal.com Clone</span>
        </div>
        <button
          onClick={() => navigate('/event-types')}
          style={{
            background: '#111111', color: '#ffffff', border: 'none',
            padding: '0.5rem 1.25rem', borderRadius: '999px',
            fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          Go to app <ArrowRight size={14} />
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '5rem 3rem', maxWidth: '1200px', margin: '0 auto', gap: '3rem',
        flexWrap: 'wrap'
      }}>
        {/* Left */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: '#f3f4f6', border: '1px solid #e5e7eb',
            borderRadius: '999px', padding: '0.3rem 0.9rem',
            fontSize: '0.8rem', fontWeight: '500', color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Now live · SDE Intern Assignment
          </div>

          <h1 style={{
            fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1',
            letterSpacing: '-0.04em', marginBottom: '1.5rem', color: '#111111'
          }}>
            The better way to schedule your meetings
          </h1>

          <p style={{
            color: '#6b7280', fontSize: '1.1rem', lineHeight: '1.7',
            marginBottom: '2rem', maxWidth: '480px'
          }}>
            Create event types, set your availability, and share your booking link. Let people schedule time with you — no back and forth.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/event-types')}
              style={{
                background: '#111111', color: '#ffffff', border: 'none',
                padding: '0.85rem 1.75rem', borderRadius: '8px',
                fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              Get started <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/bookings')}
              style={{
                background: 'transparent', color: '#111111',
                border: '1px solid #e5e7eb',
                padding: '0.85rem 1.75rem', borderRadius: '8px',
                fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              View bookings <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right — mock booking card */}
        <div style={{
          flex: 1, minWidth: '300px', maxWidth: '420px',
          background: '#ffffff', border: '1px solid #e5e7eb',
          borderRadius: '16px', padding: '2rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <img src="https://github.com/nutlope.png" alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Mohammad Kaif</div>
              <div style={{ fontSize: '1rem', fontWeight: '700' }}>30 Min Meeting</div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.25rem' }}>
            A standard 30-minute call to discuss your project or ideas.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {['15m', '30m', '45m', '1h'].map(d => (
              <span key={d} style={{
                padding: '0.3rem 0.75rem', borderRadius: '999px',
                border: d === '30m' ? '2px solid #111111' : '1px solid #e5e7eb',
                fontSize: '0.8rem', fontWeight: d === '30m' ? '600' : '400',
                background: d === '30m' ? '#111111' : 'transparent',
                color: d === '30m' ? '#ffffff' : '#6b7280'
              }}>{d}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <Clock size={14} /> 30 minutes
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.85rem' }}>
            <Calendar size={14} /> Asia/Kolkata
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#ffffff', padding: '5rem 3rem', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: '#f3f4f6', border: '1px solid #e5e7eb',
            borderRadius: '999px', padding: '0.3rem 0.9rem',
            fontSize: '0.8rem', fontWeight: '500', color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            How it works
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Appointment scheduling made simple
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '3rem' }}>
            Three steps to start getting booked.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { num: '01', title: 'Create event types', desc: 'Set up different meeting types with custom durations and unique booking links.' },
              { num: '02', title: 'Set your availability', desc: 'Define which days and hours you are open for bookings each week.' },
              { num: '03', title: 'Share your link', desc: 'Send your booking link and let people pick a time that works for both of you.' },
            ].map(({ num, title, desc }) => (
              <div key={num} style={{
                flex: '1', minWidth: '240px', maxWidth: '300px',
                background: '#fafafa', border: '1px solid #e5e7eb',
                borderRadius: '12px', padding: '2rem', textAlign: 'left'
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '8px',
                  background: '#f3f4f6', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700',
                  color: '#6b7280', marginBottom: '1rem'
                }}>{num}</div>
                <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.6' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 3rem', textAlign: 'center', background: '#fafafa' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
          Ready to get started?
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '1rem' }}>
          Go to your dashboard and create your first event type.
        </p>
        <button
          onClick={() => navigate('/event-types')}
          style={{
            background: '#111111', color: '#ffffff', border: 'none',
            padding: '0.9rem 2rem', borderRadius: '8px',
            fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          Go to dashboard <ArrowRight size={16} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #e5e7eb', padding: '2rem 3rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem', background: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} />
          <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Cal.com Clone</span>
        </div>
        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
          Built by Mohammad Kaif 
        </span>
      </footer>

    </div>
  );
}