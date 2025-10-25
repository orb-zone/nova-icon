import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('Singleton defs container creation', () => {
  let mockDocument: any;
  let mockBody: any;
  let originalDocument: any;

  beforeEach(() => {
    originalDocument = global.document;
    
    const bodyElements: any[] = [];
    const allElements: any[] = [];
    
    mockBody = {
      insertBefore: (el: any) => {
        bodyElements.push(el);
        return el;
      },
      firstChild: null,
    };
    
    mockDocument = {
      body: mockBody,
      createElementNS: (ns: string, tag: string) => {
        const el: any = {
          tagName: tag.toUpperCase(),
          style: {},
          setAttribute: function(name: string, value: string) { this[name] = value; },
          appendChild: function(child: any) { 
            allElements.push(child);
            return child;
          },
        };
        return el;
      },
      querySelector: (selector: string) => bodyElements.find(e => {
        if (selector === 'svg[aria-hidden="true"]') {
          return e.tagName === 'SVG' && e['aria-hidden'] === 'true';
        }
        return false;
      }),
    };
    
    (global as any).document = mockDocument;
    
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    NovaIconRegistry._reset();
  });

  afterEach(() => {
    (global as any).document = originalDocument;
  });

  it('should create a singleton <svg><defs> container', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    const container = NovaIconRegistry.getDefsContainer();
    
    expect(container).toBeDefined();
    expect(container.tagName).toBe('DEFS');
  });

  it('should return the same container on multiple calls', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    const container1 = NovaIconRegistry.getDefsContainer();
    const container2 = NovaIconRegistry.getDefsContainer();
    
    expect(container1).toBe(container2);
  });

  it('should create hidden SVG container', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    NovaIconRegistry.getDefsContainer();
    
    const svg = mockDocument.querySelector('svg[aria-hidden="true"]');
    expect(svg).toBeDefined();
  });
});
