// src/App.js (JS)
import React from 'react';
import { DashboardProvider } from './store/dashboardStore';
import DashboardPage from './DashboardPage';

import './index.css';
import './App.css';
import './styles.css'; // last, taaki yeh override kar sake

// function DashboardPage() {
//   const { state, setActiveCategory, setSearch, addWidget, removeWidget } = useDashboard();
//   const [open, setOpen] = useState(false);

//   const activeCategory = useMemo(
//     () => state.categories.find(c => c.id === state.activeCatId),
//     [state.categories, state.activeCatId]
//   );

//   // Global search across all widgets (simple contains)
//   const searchResults = useMemo(() => {
//     const q = state.search.trim().toLowerCase();
//     if (!q) return null;
//     const hits = [];
//     for (const c of state.categories) {
//       for (const w of c.widgets) {
//         const hay = (w.name + ' ' + (w.content || '')).toLowerCase();
//         if (hay.includes(q)) hits.push({ categoryId: c.id, categoryName: c.name, ...w });
//       }
//     }
//     return hits;
//   }, [state.search, state.categories]);

//   return (
//     <div className="layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
//       <aside className="sidebar" style={{ borderRight: '1px solid #e5e7eb', padding: 16 }}>
//         <h3 style={{ margin: '8px 0 12px' }}>Categories</h3>
//         <div style={{ display: 'grid', gap: 8 }}>
//           {state.categories.map(c => (
//             <button
//               key={c.id}
//               onClick={() => setActiveCategory(c.id)}
//               style={{
//                 textAlign: 'left',
//                 padding: '10px 12px',
//                 borderRadius: 6,
//                 border: '1px solid #e5e7eb',
//                 background: c.id === state.activeCatId ? '#eef2ff' : 'white',
//                 fontWeight: c.id === state.activeCatId ? 600 : 500,
//                 cursor: 'pointer',
//               }}
//             >
//               {c.name}
//             </button>
//           ))}
//         </div>
//       </aside>

//       <main className="content" style={{ padding: 24 }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
//           <h2 style={{ margin: 0 }}>{activeCategory ? activeCategory.name : 'Select a Category'}</h2>
//           <input
//             placeholder="Search widgets..."
//             value={state.search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 6, minWidth: 220 }}
//           />
//           <button
//             style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer' }}
//             onClick={() => setOpen(true)}
//             disabled={!state.activeCatId}
//           >
//             + Add Widget
//           </button>
//         </div>

//         {/* Search results list */}
//         {searchResults && (
//           <div style={{ marginTop: 16 }}>
//             <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
//               Showing {searchResults.length} result(s)
//             </div>
//             <div style={{ display: 'grid', gap: 10 }}>
//               {searchResults.map(hit => (
//                 <div key={hit.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, background: '#fff' }}>
//                   <div style={{ fontSize: 12, color: '#6b7280' }}>{hit.categoryName}</div>
//                   <div style={{ fontWeight: 600 }}>{hit.name}</div>
//                   <div style={{ color: '#374151' }}>{hit.content}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Active category widgets grid */}
//         <div
//           className="grid"
//           style={{ marginTop: 16, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
//         >
//           {activeCategory && activeCategory.widgets.map(w => (
//             <div key={w.id} className="card" style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: 'white' }}>
//               <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
//                 <span style={{ fontWeight: 600 }}>{w.name}</span>
//                 <button
//                   aria-label="remove"
//                   title="Remove"
//                   onClick={() => removeWidget({ categoryId: activeCategory.id, widgetId: w.id })}
//                   style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}
//                 >
//                   ×
//                 </button>
//               </div>
//               <p style={{ margin: 0, color: '#374151' }}>{w.content}</p>
//             </div>
//           ))}
//         </div>

//         <AddWidgetModal
//           open={open}
//           onClose={() => setOpen(false)}
//           defaultCategoryId={state.activeCatId}
//           onSubmit={({ categoryId, name, content }) =>
//             addWidget({ categoryId, name, content, id: createId('w') })
//           }
//         />
//       </main>
//     </div>
//   );
// }

export default function App() {
  return (
    <DashboardProvider>
      <DashboardPage />
    </DashboardProvider>
  );
}
