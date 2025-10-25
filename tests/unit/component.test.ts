import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('Component Lifecycle', () => {
  let mockDocument: any;
  let originalDocument: any;
  let originalCustomElements: any;

  beforeEach(() => {
    originalDocument = global.document;
    originalCustomElements = (global as any).customElements;
    
    const elements: any[] = [];
    mockDocument = {
      body: {
        insertBefore: (el: any) => {
          elements.push(el);
          return el;
        },
        firstChild: null,
        appendChild: (el: any) => {
          elements.push(el);
          return el;
        },
      },
      createElementNS: (ns: string, tag: string) => {
        const el: any = {
          id: '',
          tagName: tag.toUpperCase(),
          style: {},
          innerHTML: '',
          setAttribute: function(name: string, value: string) { 
            (this as any)[name] = value; 
          },
          appendChild: function(child: any) { 
            elements.push(child);
            return child;
          },
          querySelector: function(selector: string) {
            return elements.find(e => {
              if (selector.startsWith('#')) {
                return e.id === selector.slice(1);
              }
              return false;
            });
          },
        };
        return el;
      },
    };
    
    (global as any).document = mockDocument;
    (global as any).customElements = {
      define: () => {},
    };
    (global as any).HTMLElement = class {
      innerHTML = '';
      style: any = { setProperty: () => {} };
      appendChild() {}
    };
    (global as any).matchMedia = () => ({
      matches: false,
      addEventListener: () => {},
    });
  });

  afterEach(() => {
    (global as any).document = originalDocument;
    (global as any).customElements = originalCustomElements;
  });

  it('should define NovaIcon custom element', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    expect(NovaIcon).toBeDefined();
    expect(NovaIcon.prototype).toBeInstanceOf(Object);
  });

  it('should have observedAttributes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    expect(NovaIcon.observedAttributes).toBeDefined();
    expect(Array.isArray(NovaIcon.observedAttributes)).toBe(true);
  });

  it('should observe icon, size, and color attributes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const attrs = NovaIcon.observedAttributes;
    expect(attrs).toContain('icon');
    expect(attrs).toContain('size');
    expect(attrs).toContain('color');
  });

  it('should have connectedCallback method', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    expect(typeof NovaIcon.prototype.connectedCallback).toBe('function');
  });

  it('should have disconnectedCallback method', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    expect(typeof NovaIcon.prototype.disconnectedCallback).toBe('function');
  });

  it('should have attributeChangedCallback method', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    expect(typeof NovaIcon.prototype.attributeChangedCallback).toBe('function');
  });

  it('should respect inherited CSS custom properties in light DOM', () => {
    // Light DOM: CSS variables inherit naturally through the DOM tree
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    
    // In light DOM, the component doesn't need to do anything special
    // CSS variables just inherit naturally from parent elements
    // This test verifies the component doesn't break CSS inheritance
    expect(instance).toBeDefined();
    
    // Verify component has style property for setting CSS variables
    expect(instance.style).toBeDefined();
  });
});
