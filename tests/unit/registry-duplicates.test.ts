import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('Duplicate Icon Handling', () => {
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
      contains: (el: any) => elements.includes(el),
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

  it('should not overwrite existing icon by default', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    NovaIconRegistry.register('test-icon', 'M10 10 L20 20');
    NovaIconRegistry.register('test-icon', 'M0 0 L5 5');
    
    const icon = NovaIconRegistry.get('test-icon');
    expect(icon?.paths).toEqual(['M10 10 L20 20']);
  });

  it('should overwrite existing icon when overwrite option is true', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    NovaIconRegistry.register('test-icon', 'M10 10 L20 20');
    NovaIconRegistry.register('test-icon', 'M0 0 L5 5', { overwrite: true });
    
    const icon = NovaIconRegistry.get('test-icon');
    expect(icon?.paths).toEqual(['M0 0 L5 5']);
  });
});
