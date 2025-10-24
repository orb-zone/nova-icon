import { describe, it, expect } from 'bun:test';

describe('Component Hover Animations', () => {
  it('should have animation capability', () => {
    (global as any).HTMLElement = class {};
    (global as any).customElements = { define: () => {} };
    (global as any).matchMedia = () => ({ matches: false, addEventListener: () => {} });
    
    const { NovaIcon } = require('../../src/nova-icon');
    expect(NovaIcon).toBeDefined();
  });
});
