// src/utils/sportConfig.js
// Maps each sport to a unique accent color and emoji icon.
// Add new sports here if the JSON data is expanded.

export const SPORT_CONFIG = {
  // Each key matches the "sport" field in timeline.json (case-sensitive).
  // color: used for the timeline dot, card borders, and sport badges.
  // icon: emoji displayed on cards and timeline markers.

  'Baseball':         { color: '#e8534e', icon: '⚾' },
  'Football':         { color: '#e07b39', icon: '🏈' },
  'Track & Field':    { color: '#f0c040', icon: '🏃' },
  'Basketball':       { color: '#e07b39', icon: '🏀' },
  'Wrestling':        { color: '#7c9cbf', icon: '🤼' },
  'Soccer':           { color: '#5baa68', icon: '⚽' },
  'Tennis':           { color: '#b8e04a', icon: '🎾' },
  'Lacrosse':         { color: '#5baa68', icon: '🥍' },
  'Boxing':           { color: '#c0524a', icon: '🥊' },
  'Golf':             { color: '#5baa68', icon: '⛳' },
  'Rifle':            { color: '#a0a0a0', icon: '🎯' },
  'Fencing':          { color: '#c0a0e0', icon: '🤺' },
  'Gymnastics':       { color: '#e080b0', icon: '🤸' },
  'Cross-Country':    { color: '#f0c040', icon: '🏔️' },
  'Swim & Diving':    { color: '#4ab0e0', icon: '🏊' },
  'Swim//Diving':     { color: '#4ab0e0', icon: '🏊' }, // handle raw data variant
  'Softball':         { color: '#e8534e', icon: '🥎' },
  'Hockey':           { color: '#7cb8e0', icon: '🏑' },
  'Volleyball':       { color: '#e07b39', icon: '🏐' },
  "Women's Basketball": { color: '#e080b0', icon: '🏀' },
  "Womens Basketball":  { color: '#e080b0', icon: '🏀' },
};

// Fallback config for any sport not listed above
export const DEFAULT_SPORT_CONFIG = {
  color: '#C0974F', // PSU gold
  icon: '🏆',
};

// Helper: get sport config with fallback
export function getSportConfig(sport) {
  return SPORT_CONFIG[sport] || DEFAULT_SPORT_CONFIG;
}

// Decade labels for the timeline ruler marks
// Add or remove decades as your data range changes
export const DECADE_MARKERS = [
  1880, 1890, 1900, 1910, 1920, 1930,
  1940, 1950, 1960, 1970, 1980, 1990, 2000,
];
