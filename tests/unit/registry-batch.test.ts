import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('Batch Registration', () => {
  let mockDocument: any;
  let originalDocument: any;

  beforeEach(() => {
    originalDocument = global.document;
    
    const elements: any[] = [];
    mockDocument = {
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
        };
        return el;
      },
      createDocumentFragment: () => ({
        appendChild: (child: any) => child,
      }),
    };
    
    (global as any).document = mockDocument;
  });

  afterEach(() => {
    (global as any).document = originalDocument;
  });

  it('should register multiple icons at once', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    const icons = [
      { name: 'icon1', paths: ['M10 10 L20 20'] },
      { name: 'icon2', paths: ['M0 0 L5 5'] },
      { name: 'icon3', paths: ['M15 15 L25 25'] },
    ];
    
    NovaIconRegistry.registerBatch(icons);
    
    expect(NovaIconRegistry.has('icon1')).toBe(true);
    expect(NovaIconRegistry.has('icon2')).toBe(true);
    expect(NovaIconRegistry.has('icon3')).toBe(true);
  });

  it('should handle empty batch', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    expect(() => {
      NovaIconRegistry.registerBatch([]);
    }).not.toThrow();
  });
});
