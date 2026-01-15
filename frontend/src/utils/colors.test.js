import { describe, it, expect } from 'vitest';
import {
  backgrounds,
  accents,
  text,
  status,
  borders,
  difficulty,
  editor,
  colors,
} from './colors.js';

describe('colors utility', () => {
  describe('backgrounds', () => {
    it('should export slate background colors', () => {
      expect(backgrounds.base).toBe('#0f172a');
      expect(backgrounds.elevated).toBe('#1e293b');
      expect(backgrounds.hover).toBe('#334155');
      expect(backgrounds.surface).toBe('#1e293b');
    });

    it('should have all required background properties', () => {
      expect(backgrounds).toHaveProperty('base');
      expect(backgrounds).toHaveProperty('elevated');
      expect(backgrounds).toHaveProperty('hover');
      expect(backgrounds).toHaveProperty('surface');
    });
  });

  describe('accents', () => {
    it('should export amber accent colors', () => {
      expect(accents.primary).toBe('#f59e0b');
      expect(accents.light).toBe('#fbbf24');
      expect(accents.dark).toBe('#d97706');
      expect(accents.highlight).toBe('#fcd34d');
    });

    it('should have all required accent properties', () => {
      expect(accents).toHaveProperty('primary');
      expect(accents).toHaveProperty('light');
      expect(accents).toHaveProperty('dark');
      expect(accents).toHaveProperty('highlight');
    });
  });

  describe('text', () => {
    it('should export text colors with high contrast', () => {
      expect(text.primary).toBe('#f8fafc');
      expect(text.secondary).toBe('#e2e8f0');
      expect(text.muted).toBe('#94a3b8');
      expect(text.disabled).toBe('#64748b');
    });
  });

  describe('status', () => {
    it('should export status colors', () => {
      expect(status.success).toBe('#10b981');
      expect(status.error).toBe('#ef4444');
      expect(status.warning).toBe('#f59e0b');
      expect(status.info).toBe('#3b82f6');
    });
  });

  describe('borders', () => {
    it('should export border colors', () => {
      expect(borders.default).toBe('#334155');
      expect(borders.light).toBe('#475569');
      expect(borders.dark).toBe('#1e293b');
    });
  });

  describe('difficulty', () => {
    it('should export difficulty badge colors', () => {
      expect(difficulty.easy).toBe('#10b981');
      expect(difficulty.medium).toBe('#f59e0b');
      expect(difficulty.hard).toBe('#ef4444');
    });

    it('should have distinct colors for each difficulty level', () => {
      expect(difficulty.easy).not.toBe(difficulty.medium);
      expect(difficulty.medium).not.toBe(difficulty.hard);
      expect(difficulty.easy).not.toBe(difficulty.hard);
    });
  });

  describe('editor', () => {
    it('should export Monaco editor theme colors', () => {
      expect(editor.background).toBe('#1e293b');
      expect(editor.foreground).toBe('#e2e8f0');
      expect(editor.cursor).toBe('#fbbf24');
    });

    it('should have syntax highlighting colors', () => {
      expect(editor.keyword).toBe('#FBBF24');
      expect(editor.string).toBe('#10B981');
      expect(editor.number).toBe('#F59E0B');
      expect(editor.function).toBe('#60A5FA');
    });
  });

  describe('colors default export', () => {
    it('should export all color categories', () => {
      expect(colors).toHaveProperty('backgrounds');
      expect(colors).toHaveProperty('accents');
      expect(colors).toHaveProperty('text');
      expect(colors).toHaveProperty('status');
      expect(colors).toHaveProperty('borders');
      expect(colors).toHaveProperty('difficulty');
      expect(colors).toHaveProperty('editor');
    });

    it('should match individual exports', () => {
      expect(colors.backgrounds).toEqual(backgrounds);
      expect(colors.accents).toEqual(accents);
      expect(colors.text).toEqual(text);
      expect(colors.status).toEqual(status);
      expect(colors.borders).toEqual(borders);
      expect(colors.difficulty).toEqual(difficulty);
      expect(colors.editor).toEqual(editor);
    });
  });

  describe('color format validation', () => {
    it('should use valid hex color format', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/;
      
      // Test a sample of colors
      expect(backgrounds.base).toMatch(hexColorRegex);
      expect(accents.primary).toMatch(hexColorRegex);
      expect(text.primary).toMatch(hexColorRegex);
      expect(status.success).toMatch(hexColorRegex);
      expect(editor.selection).toMatch(hexColorRegex); // includes alpha
    });
  });
});
