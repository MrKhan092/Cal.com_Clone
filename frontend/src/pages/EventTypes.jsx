import React, { useEffect, useState } from 'react';
import api from '../api';
import { Plus, Search, ExternalLink, Link as LinkIcon, MoreHorizontal, Clock, Edit2, Trash2 } from 'lucide-react';

export default function EventTypes() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', duration: 15, slug: '' });
  
  const [openDropdown, setOpenDropdown] = useState(null);

  const fetchEventTypes = async () => {
    try { const { data } = await api.get('/event-types'); setEventTypes(data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchEventTypes(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event type?")) return;
    try { await api.delete(`/event-types/${id}`); fetchEventTypes(); } catch(err) {}
  };

  const handleEdit = (event) => {
    setFormData({ title: event.title, description: event.description || '', duration: event.duration, slug: event.slug });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/event-types/${editingId}`, formData);
      else await api.post('/event-types', formData);
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', duration: 15, slug: '' });
      fetchEventTypes();
    } catch (err) { alert('Failed to save event type'); }
  };

  if (showForm) {
    return (
      <div className="card" style={{ maxWidth: '600px' }}>
        <h2>{editingId ? 'Edit Event Type' : 'New Event Type'}</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input required type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">URL Slug</label>
            <input required type="text" className="form-input" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              style={{ minHeight: '100px', resize: 'vertical', paddingTop: '0.75rem' }} 
              placeholder="A quick video meeting."
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input required type="number" min="5" className="form-input" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} />
          </div>
          <div className="flex gap-4 mt-6">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2>Event types</h2>
          <p>Configure different events for people to book on your calendar.</p>
        </div>
        <div className="flex gap-4 items-center">
          <button className="btn btn-primary" onClick={() => { setFormData({ title: '', description: '', duration: 15, slug: '' }); setEditingId(null); setShowForm(true); }}>
            <Plus size={16} /> New
          </button>
        </div>
      </div>

      <div className="mb-6" style={{ position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input 
          type="text" 
          placeholder="Search event types..." 
          className="form-input" 
          style={{ width: '100%', paddingLeft: '40px' }} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="list-container">
        {loading ? <div className="list-item"><p>Loading...</p></div> : 
          eventTypes.length === 0 ? <div className="list-item"><p>No event types configured.</p></div> : 
          eventTypes.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.slug.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? <div className="list-item"><p>No results found for "{searchTerm}".</p></div> : 
          eventTypes.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.slug.toLowerCase().includes(searchTerm.toLowerCase())).map(event => (
          <div key={event.id} className="list-item">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">{event.title}</span>
                <span className="text-secondary text-xs" style={{marginTop: '2px'}}>/clone/{event.slug}</span>
              </div>
              <p className="mb-3" style={{fontSize: '0.85rem'}}>{event.description}</p>
              <div className="badge-dark">
                <Clock size={12} /> {event.duration}m
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <a href={`/${event.slug}`} target="_blank" rel="noreferrer" className="btn-icon" title="View Public Page">
                <ExternalLink size={16} />
              </a>
              <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${event.slug}`)} className="btn-icon" title="Copy Link">
                <LinkIcon size={16} />
              </button>
              
              <div style={{ position: 'relative' }}>
                <button onClick={() => setOpenDropdown(openDropdown === event.id ? null : event.id)} className="btn-icon" title="Options">
                  <MoreHorizontal size={16} />
                </button>
                {openDropdown === event.id && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={() => { handleEdit(event); setOpenDropdown(null); }}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button className="dropdown-item danger" onClick={() => { handleDelete(event.id); setOpenDropdown(null); }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
