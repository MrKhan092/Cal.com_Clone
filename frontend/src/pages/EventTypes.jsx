import React, { useEffect, useState } from 'react';
import api from '../api';
import { Plus, Link, Clock, Trash, Edit } from 'lucide-react';

export default function EventTypes() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', duration: 15, slug: '' });

  const fetchEventTypes = async () => {
    try {
      const { data } = await api.get('/event-types');
      setEventTypes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEventTypes(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event type?")) return;
    try {
      await api.delete(`/event-types/${id}`);
      fetchEventTypes();
    } catch(err) { console.error(err); }
  };

  const handleEdit = (event) => {
    setFormData({ title: event.title, description: event.description || '', duration: event.duration, slug: event.slug });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/event-types/${editingId}`, formData);
      } else {
        await api.post('/event-types', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', duration: 15, slug: '' });
      fetchEventTypes();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save event type');
    }
  };

  if (showForm) {
    return (
      <div className="card fade-in" style={{ maxWidth: '600px' }}>
        <h2>{editingId ? 'Edit Event Type' : 'New Event Type'}</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input required type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="15 Min Meeting" />
          </div>
          <div className="form-group">
            <label className="form-label">URL Slug</label>
            <div className="flex items-center">
              <span className="text-secondary" style={{ padding: '0.625rem 0.75rem', border: '1px solid var(--border-light)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', backgroundColor: 'var(--bg-secondary)' }}>/</span>
              <input required type="text" style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }} className="form-input flex-1" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} placeholder="15min" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input required type="number" min="5" className="form-input" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea className="form-input" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Meeting description..." />
          </div>
          <div className="flex gap-4 mt-6">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2>Event Types</h2>
          <p>Create events to share for people to book on your calendar.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} /> New Event Type
        </button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: '300px', width: '100%' }}></div>
      ) : (
        <div className="event-grid">
          {eventTypes.map(event => (
            <div key={event.id} className="card flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold">{event.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(event)} className="btn btn-secondary" style={{ padding: '0.4rem' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="btn btn-danger" style={{ padding: '0.4rem' }}>
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                <p className="mb-4 text-sm">{event.description}</p>
                <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Clock size={16} /> {event.duration}m
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Link size={16} /> /{event.slug}
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center border-t border-light pt-4" style={{ borderColor: 'var(--border-light)' }}>
                <a href={`/${event.slug}`} target="_blank" rel="noreferrer" className="btn btn-secondary text-sm">
                  View Page
                </a>
                <button className="btn btn-secondary text-sm" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${event.slug}`)}>Copy Link</button>
              </div>
            </div>
          ))}
          {eventTypes.length === 0 && (
            <div className="card text-center py-10" style={{ gridColumn: '1 / -1' }}>
              <p>No event types created yet. Create your first one!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
