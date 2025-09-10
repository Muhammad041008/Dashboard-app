// src/components/ManageCategoryModal.js
import React from 'react';

export default function ManageCategoryModal({
  open,
  onClose,
  category,
  onToggle, // (widgetId, checked:boolean) => void
  search,
  setSearch,
}) {
  if (!open || !category) return null; // [assignment]

  const widgets = category.widgets.filter(w => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (w.name + ' ' + (w.content || '')).toLowerCase().includes(q);
  }); // [assignment]

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'grid', placeItems: 'center', zIndex: 60 }}
      aria-modal="true"
      role="dialog"
    >
      <div onClick={e => e.stopPropagation()} style={{ width: 520, maxHeight: '70vh', overflow: 'auto', background: '#fff', borderRadius: 8, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <h3 style={{ margin: 0 }}>Manage: {category.name}</h3>
          <button onClick={onClose} style={{ border: '1px solid #e5e7eb', borderRadius: 6 }}>×</button>
        </div>

        <input
          placeholder="Search in this category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', marginTop: 12, marginBottom: 12, padding: 8, border: '1px solid #e5e7eb', borderRadius: 6 }}
        />

        <div style={{ display: 'grid', gap: 8 }}>
          {widgets.map(w => (
            <label key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #e5e7eb', borderRadius: 8, padding: 10 }}>
              <input
                type="checkbox"
                checked={true}
                onChange={(e) => onToggle(w.id, e.target.checked)}
              />
              <div>
                <div style={{ fontWeight: 600 }}>{w.name}</div>
                <div style={{ color: '#374151', fontSize: 13 }}>{w.content}</div>
              </div>
            </label>
          ))}
          {widgets.length === 0 && <div style={{ color: '#6b7280' }}>No widgets match</div>}
        </div>
      </div>
    </div>
  );
}
