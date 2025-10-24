import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('NovaIcon.register() API Contract', () => {
  let originalDocument: any;
  
  beforeEach(() => {
    originalDocument = global.document;
    
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
          remove: function() {
            const idx = elements.indexOf(this);
            if (idx > -1) elements.splice(idx, 1);
          },
        };
        return el;
      },
    };
    
    (global as any).document = mockDocument;
  });

  afterEach(() => {
    (global as any).document = originalDocument;
  });

  it('should have static register method', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    expect(typeof NovaIconRegistry.register).toBe('function');
  });

  it('should have static registerBatch method', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    expect(typeof NovaIconRegistry.registerBatch).toBe('function');
  });

  it('should have static get method', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    expect(typeof NovaIconRegistry.get).toBe('function');
  });

  it('should have static has method', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    expect(typeof NovaIconRegistry.has).toBe('function');
  });

  it('should accept name, pathData, and optional options', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    expect(() => {
      NovaIconRegistry.register('test-icon', 'M10 10 L20 20');
    }).not.toThrow();
  });
});
