/**
 * Theme color constants for LocalCode UI
 * New color palette: #22223b (background), #c9ada7 (primary), #f2e9e4 (text), #9a8c98 and #4a4e69 (accents)
 */

// Background colors
export const backgrounds = {
  base: '#22223b',      // Main background
  elevated: '#4a4e69',  // Elevated surfaces (cards, panels)
  hover: '#3a3e59',     // Hover states
  surface: '#4a4e69',   // Surface elements
};

// Accent colors
export const accents = {
  primary: '#c9ada7',   // Primary accent
  light: '#d9bdb7',     // Light accent
  dark: '#b89a94',      // Dark accent
  highlight: '#e9d9d4', // Highlights
  secondary: '#9a8c98', // Secondary accent
};

// Text colors
export const text = {
  primary: '#f2e9e4',   // Primary text
  secondary: '#e2d9d4', // Secondary text
  muted: '#c9ada7',     // Muted text
  disabled: '#9a8c98',  // Disabled text
};

// Status colors
export const status = {
  success: '#10b981',   // emerald-500 - Success states
  error: '#ef4444',     // red-500 - Error states
  warning: '#c9ada7',   // primary - Warning states
  info: '#9a8c98',      // accent1 - Info states
};

// Border colors
export const borders = {
  default: '#9a8c98',   // Default borders
  light: '#c9ada7',     // Light borders
  dark: '#4a4e69',      // Dark borders
};

// Difficulty badge colors
export const difficulty = {
  easy: '#10b981',      // emerald-500 - Easy problems
  medium: '#c9ada7',    // primary - Medium problems
  hard: '#ef4444',      // red-500 - Hard problems
};

// Editor colors (for Monaco theme)
export const editor = {
  background: '#22223b',
  foreground: '#f2e9e4',
  lineHighlight: '#4a4e69',
  selection: '#c9ada733', // primary with transparency
  cursor: '#c9ada7',
  lineNumber: '#9a8c98',
  comment: '#9a8c98',
  keyword: '#c9ada7',
  string: '#10b981',
  number: '#c9ada7',
  function: '#d9bdb7',
};

// Export all colors as a single object for convenience
export const colors = {
  backgrounds,
  accents,
  text,
  status,
  borders,
  difficulty,
  editor,
};

export default colors;
