// src/utils/id.js
export const createId = (prefix = 'w') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
