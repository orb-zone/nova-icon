import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('Registry Operations', () => {
  let mockDocument: any;
  let originalDocument: any;

  beforeEach(() => {
    originalDocument = global.document;
    
    const elements: any[] = [];
    mockDocument = {
      body: {
        insertBefore: (el: any) => el,
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
    
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    NovaIconRegistry._reset();
  });

  afterEach(() => {
    (global as any).document = originalDocument;
  });

  it('should register an icon', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    NovaIconRegistry.register('test-icon', 'M10 10 L20 20');
    
    expect(NovaIconRegistry.has('test-icon')).toBe(true);
  });

  it('should retrieve a registered icon', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    const pathData = 'M10 10 L20 20';
    NovaIconRegistry.register('test-icon', pathData);
    
    const icon = NovaIconRegistry.get('test-icon');
    expect(icon).toBeDefined();
    expect(icon?.paths).toEqual([pathData]);
  });

  it('should return undefined for non-existent icon', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    const icon = NovaIconRegistry.get('non-existent');
    
    expect(icon).toBeUndefined();
  });

  it('should check if icon exists', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    NovaIconRegistry.register('test-icon', 'M10 10 L20 20');
    
    expect(NovaIconRegistry.has('test-icon')).toBe(true);
    expect(NovaIconRegistry.has('non-existent')).toBe(false);
  });
});
