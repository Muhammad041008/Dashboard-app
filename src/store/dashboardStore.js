// src/store/dashboardStore.js
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

// Persistence
const STORAGE_KEY = 'ak-dashboard-state-v2';

// Seed / Initial State
const initialState = {
  search: '',
  activeCatId: 'cat_cnapp',
  categories: [
    {
      id: 'cat_cnapp',
      name: 'CNAPP Dashboard',
      widgets: [
        {
          id: 'w_cnapp_car',
          name: 'Cloud Account Risk Assessment',
          content: 'Random text',
          stats: { total: 9659, failed: 1689, warning: 681, na: 36, passed: 7253 },
        },
        { id: 'w_cnapp_ns', name: 'Top 5 Namespace Specific Alerts', content: 'Random text' },
        { id: 'w_cnapp_misc', name: 'kuch', content: 'jfdjbdfvf' },
      ],
    },
    {
      id: 'cat_cspm',
      name: 'CSPM Executive Dashboard',
      widgets: [
        { id: 'w_cspm_1', name: 'Workload Alerts', content: 'Random text' },
        { id: 'w_cspm_2', name: 'Registry Scan', content: 'Random text' },
      ],
    },
    {
      id: 'cat_cloud',
      name: 'Cloud Accounts',
      widgets: [
        { id: 'w_cloud_1', name: 'Connected', content: 'Random text' },
        { id: 'w_cloud_2', name: 'Not Connected', content: 'Random text' },
      ],
    },
    {
      id: 'cat_cwpp',
      name: 'CWPP Dashboard',
      widgets: [
        { id: 'w_cwpp_1', name: 'Image Risk Assessment', content: 'Random text' },
        { id: 'w_cwpp_2', name: 'Image Security Issues', content: 'Random text' },
      ],
    },
  ],
};

// Reducer (pure, immutable updates)
function reducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_CATEGORY': {
      return { ...state, activeCatId: action.payload };
    }
    case 'SET_SEARCH': {
      return { ...state, search: action.payload };
    }
    case 'ADD_WIDGET': {
      const { categoryId, id, name, content, stats } = action.payload;
      const categories = state.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              widgets: [...c.widgets, { id, name, content, ...(stats ? { stats } : {}) }],
            }
          : c
      );
      return { ...state, categories };
    }
    case 'REMOVE_WIDGET': {
      const { categoryId, widgetId } = action.payload;
      const categories = state.categories.map((c) =>
        c.id === categoryId ? { ...c, widgets: c.widgets.filter((w) => w.id !== widgetId) } : c
      );
      return { ...state, categories };
    }
    case 'UPDATE_WIDGET_STATS': {
      const { categoryId, widgetId, stats } = action.payload;
      const categories = state.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              widgets: c.widgets.map((w) => (w.id === widgetId ? { ...w, stats: { ...stats } } : w)),
            }
          : c
      );
      return { ...state, categories };
    }
    default:
      return state;
  }
}

// ------------------------------
// Context + Provider
// ------------------------------
const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  // Restore from localStorage if available
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : init;
    } catch {
      return init;
    }
  });

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore write errors
    }
  }, [state]);

  // Actions (stable via useMemo)
  const api = useMemo(() => {
    return {
      state,
      setActiveCategory: (catId) =>
        dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: catId }),
      setSearch: (q) => dispatch({ type: 'SET_SEARCH', payload: q }),
      addWidget: ({ categoryId, id, name, content, stats }) =>
        dispatch({ type: 'ADD_WIDGET', payload: { categoryId, id, name, content, stats } }),
      removeWidget: ({ categoryId, widgetId }) =>
        dispatch({ type: 'REMOVE_WIDGET', payload: { categoryId, widgetId } }),
      updateWidgetStats: ({ categoryId, widgetId, stats }) =>
        dispatch({ type: 'UPDATE_WIDGET_STATS', payload: { categoryId, widgetId, stats } }),
    };
  }, [state]);

  return <DashboardContext.Provider value={api}>{children}</DashboardContext.Provider>;
}

// Hook
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
