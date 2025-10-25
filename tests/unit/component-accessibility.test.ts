import { describe, it, expect, beforeEach } from 'bun:test';

describe('Component Accessibility', () => {
  beforeEach(() => {
    // Light DOM: component renders to innerHTML (no shadow root)
    (global as any).HTMLElement = class {
      innerHTML = '';
      style = { setProperty: () => {} };
    };
    (global as any).customElements = { define: () => {} };
    (global as any).window = {
      matchMedia: (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        addEventListener: () => {},
      }),
    };
  });

  it('should detect prefers-reduced-motion', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    
    expect(instance.reducedMotion).toBe(true);
  });

  it('should default to no reduced motion', () => {
    (global as any).window = {
      matchMedia: () => ({
        matches: false,
        addEventListener: () => {},
      }),
    };
    
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    
    expect(instance.reducedMotion).toBe(false);
  });
});
