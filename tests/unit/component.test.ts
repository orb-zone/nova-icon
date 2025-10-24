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
    (global as any).HTMLElement = class {};
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
});
