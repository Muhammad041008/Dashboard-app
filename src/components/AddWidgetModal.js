// src/components/AddWidgetModal.js (replace completely)
import React, { useState, useEffect } from 'react';
import { useDashboard } from '../store/dashboardStore';

export default function AddWidgetModal({ open, onClose, onSubmit, defaultCategoryId }) {
  const { state } = useDashboard(); // read categories from context [2]
  const [categoryId, setCategoryId] = useState(defaultCategoryId || '');
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setCategoryId(defaultCategoryId || state.activeCatId || ''); // keep current active as fallback [2]
  }, [defaultCategoryId, state.activeCatId]);

  if (!open) return null; // conditional render [8]

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryId || !name.trim()) return; // guard [8]
    onSubmit({
      categoryId,
      name: name.trim(),
      content: content.trim() || 'Random text',
    }); // dispatch payload [3]
    setName('');
    setContent('');
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h3 style={{ margin:0 }}>Add Widget</h3>
          <button className="close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop:12, display:'grid', gap:10 }}>
          <label>
            <div className="badge">Category</div>
            <select
              className="input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>Select category</option>
              {state.categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>

          <label>
            <div className="badge">Widget Name</div>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cloud Account Risk Assessment"
              required
            />
          </label>

          <label>
            <div className="badge">Widget Text</div>
            <textarea
              className="textarea"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Random text"
            />
          </label>

          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
