import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('Component Rendering with Registered Icons', () => {
  let originalDocument: any;
  let originalCustomElements: any;
  let originalWindow: any;
  let originalHTMLElement: any;

  beforeEach(() => {
    originalDocument = global.document;
    originalCustomElements = (global as any).customElements;
    originalWindow = (global as any).window;
    originalHTMLElement = (global as any).HTMLElement;
    
    (global as any).HTMLElement = class {
      getAttribute(name: string) { return (this as any)[`_${name}`]; }
      setAttribute(name: string, value: string) { (this as any)[`_${name}`] = value; }
      appendChild(child: any) { return child; }
      innerHTML = '';
    };
    (global as any).customElements = { define: () => {} };
    (global as any).window = {
      matchMedia: () => ({ matches: false, addEventListener: () => {} }),
    };
    
    const elements: any[] = [];
    const mockDocument: any = {
      body: {
        insertBefore: (el: any) => {
          elements.push(el);
          return el;
        },
        firstChild: null,
      },
      createElementNS: (ns: string, tag: string) => {
        const el: any = {
          id: '',
          tagName: tag.toUpperCase(),
          style: { setProperty: () => {}, color: '', display: '' },
          innerHTML: '',
          setAttribute: function(name: string, value: string) { 
            (this as any)[name] = value; 
          },
          appendChild: function(child: any) { 
            elements.push(child);
            return child;
          },
          setAttributeNS: function(ns: string, name: string, value: string) { 
            (this as any)[name] = value; 
          },
          querySelector: function(selector: string) {
            return elements.find(e => {
              if (selector.startsWith('#')) {
                return e.id === selector.slice(1);
              }
              return false;
            });
          },
          remove: function() {
            const idx = elements.indexOf(this);
            if (idx > -1) elements.splice(idx, 1);
          },
        };
        return el;
      },
    };
    
    (global as any).document = mockDocument;
    
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    NovaIconRegistry._reset();
  });

  afterEach(() => {
    (global as any).document = originalDocument;
    (global as any).customElements = originalCustomElements;
    (global as any).window = originalWindow;
    (global as any).HTMLElement = originalHTMLElement;
  });

  it('should render icon when registered', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    const { NovaIcon } = require('../../src/nova-icon');
    
    NovaIconRegistry.register('test-icon', 'M10 10 L20 20');
    
    const instance = new NovaIcon();
    instance.setAttribute('icon', 'test-icon');
    
    expect(() => {
      instance.connectedCallback();
    }).not.toThrow();
  });
});
