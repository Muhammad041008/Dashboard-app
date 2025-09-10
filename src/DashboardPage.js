// src/DashboardPage.js
import React, { useMemo, useState } from 'react';
import { useDashboard } from './store/dashboardStore';
import AddWidgetModal from './components/AddWidgetModal';
import { createId } from './utils/id';

// Donut + legend + meters using CSS variables and conic-gradient
function StatusPanel({ total, counts }) {
  const { failed = 0, warning = 0, na = 0, passed = 0 } = counts || {};
  const toPct = (n) => (total ? Math.round((n / total) * 1000) / 10 : 0);
  const pFail = toPct(failed), pWarn = toPct(warning), pNa = toPct(na), pPass = toPct(passed);
  return (
    <>
      <div className="donut"
           style={{ '--fail': `${pFail}%`, '--warn': `${pWarn}%`, '--na': `${pNa}%`, '--pass': `${pPass}%` }}
           data-total={total}/>
      <div className="legend">
        <span className="chip"><i className="dot fail" /> Failed ({failed})</span>
        <span className="chip"><i className="dot warn" /> Warning ({warning})</span>
        <span className="chip"><i className="dot na" /> Not available ({na})</span>
        <span className="chip"><i className="dot pass" /> Passed ({passed})</span>
      </div>
      <div className="status">
        <div className="status-row is-fail" style={{ '--pct': pFail }}>
          <div className="label"><span>Failed</span><span>{pFail}%</span></div>
          <div className="meter"><div className="meter-fill" /></div>
        </div>
        <div className="status-row is-warn" style={{ '--pct': pWarn }}>
          <div className="label"><span>Warning</span><span>{pWarn}%</span></div>
          <div className="meter"><div className="meter-fill" /></div>
        </div>
        <div className="status-row is-na" style={{ '--pct': pNa }}>
          <div className="label"><span>Not available</span><span>{pNa}%</span></div>
          <div className="meter"><div className="meter-fill" /></div>
        </div>
        <div className="status-row is-pass" style={{ '--pct': pPass }}>
          <div className="label"><span>Passed</span><span>{pPass}%</span></div>
          <div className="meter"><div className="meter-fill" /></div>
        </div>
      </div>
    </>
  );
}

// Inline editor for counts/percent with controlled inputs
function StatsEditor({ initial, onSave }) {
  const [mode, setMode] = useState('counts'); // 'counts' | 'percent'
  const [failed, setFailed] = useState(initial?.failed ?? 0);
  const [warning, setWarning] = useState(initial?.warning ?? 0);
  const [na, setNa] = useState(initial?.na ?? 0);
  const [passed, setPassed] = useState(initial?.passed ?? 0);

  // Derived values
  const totalCounts = failed + warning + na + passed;
  const toPct = (n, t) => (t ? Math.round((n / t) * 1000) / 10 : 0);
  const pFail = mode === 'counts' ? toPct(failed, totalCounts) : failed;
  const pWarn = mode === 'counts' ? toPct(warning, totalCounts) : warning;
  const pNa   = mode === 'counts' ? toPct(na, totalCounts) : na;
  const pPass = mode === 'counts' ? toPct(passed, totalCounts) : passed;
  const pctSum = pFail + pWarn + pNa + pPass;

  const save = () => {
    if (mode === 'percent') {
      // Normalize to 100 and convert to counts base 100
      const norm = (x) => Math.max(0, Math.min(100, Number(x)||0));
      const fp = norm(pFail), wp = norm(pWarn), np = norm(pNa), pp = norm(pPass);
      const clampTotal = fp + wp + np + pp || 0;
      if (Math.abs(clampTotal - 100) > 0.5) return; // simple guard
      onSave({
        total: 100,
        failed: Math.round(fp),
        warning: Math.round(wp),
        na: Math.round(np),
        passed: Math.round(pp),
      });
      return;
    }
    onSave({
      total: totalCounts,
      failed: Math.max(0, Math.round(failed)),
      warning: Math.max(0, Math.round(warning)),
      na: Math.max(0, Math.round(na)),
      passed: Math.max(0, Math.round(passed)),
    });
  };

  const numberInput = (value, setter, min=0) => (
    <input className="input" type="number" min={min} value={value}
      onChange={(e) => setter(Number(e.target.value))} />
  ); // controlled input pattern [2][3]

  return (
    <div style={{ display:'grid', gap:8, marginTop:8 }}>
      <div style={{ display:'flex', gap:8 }}>
        <label className="chip">
          <input type="radio" name="mode" checked={mode==='counts'} onChange={() => setMode('counts')} /> Counts
        </label>
        <label className="chip">
          <input type="radio" name="mode" checked={mode==='percent'} onChange={() => setMode('percent')} /> Percent
        </label>
      </div>

      {mode === 'counts' ? (
        <>
          <div style={{ display:'grid', gap:6 }}>
            <label>Failed {numberInput(failed, setFailed)}</label>
            <label>Warning {numberInput(warning, setWarning)}</label>
            <label>Not available {numberInput(na, setNa)}</label>
            <label>Passed {numberInput(passed, setPassed)}</label>
          </div>
          <div className="badge">Total: {totalCounts} • F {toPct(failed,totalCounts)}% • W {toPct(warning,totalCounts)}% • NA {toPct(na,totalCounts)}% • P {toPct(passed,totalCounts)}%</div>
        </>
      ) : (
        <>
          <div style={{ display:'grid', gap:6 }}>
            <label>Failed % {numberInput(pFail, (v)=>setFailed(v), 0)}</label>
            <label>Warning % {numberInput(pWarn, (v)=>setWarning(v), 0)}</label>
            <label>Not available % {numberInput(pNa, (v)=>setNa(v), 0)}</label>
            <label>Passed % {numberInput(pPass, (v)=>setPassed(v), 0)}</label>
          </div>
          <div className="badge">Percent sum: {pctSum}% (should be 100%)</div>
        </>
      )}

      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <button className="btn" onClick={save}>Save</button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { state, setActiveCategory, setSearch, addWidget, removeWidget, updateWidgetStats } = useDashboard();

  const [open, setOpen] = useState(false);

  const activeCategory = useMemo(
    () => state.categories.find((c) => c.id === state.activeCatId),
    [state.categories, state.activeCatId]
  );

  // Global search; null when blank so nothing extra renders
  const searchResults = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    if (!q) return null;
    const hits = [];
    for (const c of state.categories) {
      for (const w of c.widgets) {
        const hay = (w.name + ' ' + (w.content || '')).toLowerCase();
        if (hay.includes(q)) hits.push({ categoryId: c.id, categoryName: c.name, ...w });
      }
    }
    return hits;
  }, [state.search, state.categories]); // conditional rendering idiom [23][24]

  // Friendly defaults by name (optional)
  const statsMap = useMemo(() => ({
    'Cloud Account Risk Assessment': { total: 9659, failed: 1689, warning: 681, na: 36, passed: 7253 },
    'Top 5 Namespace Specific Alerts': { total: 200, failed: 20, warning: 35, na: 5, passed: 140 },
  }), []); // list rendering uses map with keys [25]

  // OPTION B: id -> stats for other categories
  const statsById = useMemo(() => ({
    w_cspm_1: { total: 200,  failed: 20,  warning: 35,  na: 5,  passed: 140 },
    w_cspm_2: { total: 1470, failed: 120, warning: 210, na: 10, passed: 1130 },
    w_cloud_1:{ total: 10,   failed: 0,   warning: 0,   na: 0,  passed: 10 },
    w_cloud_2:{ total: 5,    failed: 5,   warning: 0,   na: 0,  passed: 0 },
    w_cwpp_1: { total: 220,  failed: 40,  warning: 60,  na: 5,  passed: 115 },
    w_cwpp_2: { total: 180,  failed: 30,  warning: 50,  na: 0,  passed: 100 },
  }), []); // ids align with list/key guidance [26]

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Categories</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {state.categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`category-btn ${c.id === state.activeCatId ? 'active' : ''}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="content" style={{ padding: 24 }}>
        {/* Top bar */}
        <div className="topbar">
          <h2 style={{ margin: 0 }}>{activeCategory ? activeCategory.name : 'Select a Category'}</h2>
          <input
            className="search"
            placeholder="Search widgets..."
            value={state.search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => setOpen(true)} disabled={!state.activeCatId}>
            + Add Widget
          </button>
        </div>

        {/* Primary grid */}
        <div className="grid" style={{ marginTop: 16 }}>
          {activeCategory && activeCategory.widgets.map((w) => {
            const localStats = w.stats ?? statsById[w.id] ?? statsMap[w.name];

            return (
              <div key={w.id} className="card">
                <div className="card-header">
                  <span style={{ fontWeight: 600 }}>{w.name}</span>
                  <button
                    className="close"
                    aria-label="remove"
                    title="Remove"
                    onClick={() => removeWidget({ categoryId: activeCategory.id, widgetId: w.id })}
                  >
                    ×
                  </button>
                </div>

                {localStats ? (
                  <StatusPanel total={localStats.total} counts={localStats} />
                ) : (
                  <p style={{ margin: 0 }}>{w.content}</p>
                )}

                {/* Inline editor toggle */}
                <details style={{ marginTop: 8 }}>
                  <summary className="badge" style={{ cursor: 'pointer' }}>Edit stats (counts or %)</summary>
                  <StatsEditor
                    initial={localStats}
                    onSave={(stats) =>
                      updateWidgetStats({
                        categoryId: activeCategory.id,
                        widgetId: w.id,
                        stats, // { total, failed, warning, na, passed }
                      })
                    }
                  />
                </details>
              </div>
            );
          })}
        </div>

        {/* Only show results on search */}
        {searchResults ? (
          <div style={{ marginTop: 16 }}>
            <div className="badge">Search Results ({searchResults.length})</div>
            <div className="list">
              {searchResults.map((hit) => (
                <div key={hit.id} className="list-item">
                  <div className="badge">{hit.categoryName}</div>
                  <div style={{ fontWeight: 600 }}>{hit.name}</div>
                  <div>{hit.content}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Modal */}
        <AddWidgetModal
          open={open}
          onClose={() => setOpen(false)}
          defaultCategoryId={state.activeCatId}
          onSubmit={({ categoryId, name, content }) =>
            addWidget({ categoryId, name, content, id: createId('w') })
          }
        />
      </main>
    </div>
  );
}
