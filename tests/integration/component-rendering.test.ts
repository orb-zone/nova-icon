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

    // Light DOM: No shadow root, component renders directly to innerHTML
    class MockHTMLElement {
      _attributes: Record<string, string> = {};
      innerHTML = '';
      _children: any[] = [];
      style: any = {
        setProperty: () => {},
      };

      getAttribute(name: string) {
        return this._attributes[name];
      }

      setAttribute(name: string, value: string) {
        this._attributes[name] = value;
      }

      hasAttribute(name: string) {
        return !!this._attributes[name];
      }

      removeAttribute(name: string) {
        delete this._attributes[name];
      }

      appendChild(child: any) {
        this._children.push(child);
        return child;
      }

      querySelector(selector: string) {
        // Light DOM: query direct children
        if (selector === 'svg') {
          return this._children.find(c => c.tagName === 'SVG');
        }
        if (selector === 'use') {
          const svg = this._children.find(c => c.tagName === 'SVG');
          return svg?._children?.find((c: any) => c.tagName === 'USE');
        }
        return null;
      }
    }

    (global as any).HTMLElement = MockHTMLElement;
    (global as any).customElements = { define: () => { } };
    (global as any).window = {
      matchMedia: () => ({ matches: false, addEventListener: () => { } }),
      dispatchEvent: () => true,
      addEventListener: () => {},
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
      contains: (el: any) => elements.includes(el),
      createElement: (tag: string) => {
        return {
          tagName: tag.toUpperCase(),
          textContent: '',
        };
      },
      createElementNS: (ns: string, tag: string) => {
        const el: any = {
          id: '',
          tagName: tag.toUpperCase(),
          style: { setProperty: () => { }, color: '', display: '' },
          innerHTML: '',
          _children: [] as any[],
          setAttribute: function (name: string, value: string) {
            (this as any)[name] = value;
          },
          appendChild: function (child: any) {
            this._children.push(child);
            elements.push(child);
            return child;
          },
          setAttributeNS: function (ns: string, name: string, value: string) {
            (this as any)[name] = value;
          },
          querySelector: function (selector: string) {
            return elements.find(e => {
              if (selector.startsWith('#')) {
                return e.id === selector.slice(1);
              }
              return false;
            });
          },
          remove: function () {
            const idx = elements.indexOf(this);
            if (idx > -1) elements.splice(idx, 1);
          },
        };
        return el;
      },
    };

    (global as any).document = mockDocument;

    delete require.cache[require.resolve('../../src/runtime/registry')];
    delete require.cache[require.resolve('../../src/nova-icon')];

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
    instance.connectedCallback();

    // Light DOM: should have SVG as direct child
    const svg = instance.querySelector('svg');
    expect(svg).toBeDefined();
    
    // Light DOM: SVG should contain <use> element referencing shared symbol
    const use = instance.querySelector('use');
    expect(use).toBeDefined();
    expect(use?.href || use?.['xlink:href']).toContain('#test-icon');
  });

  it('should support Tailwind utility classes on component element', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    const { NovaIcon } = require('../../src/nova-icon');

    NovaIconRegistry.register('tailwind-icon', 'M5 5 L15 15');

    const instance = new NovaIcon();
    // Simulate Tailwind classes being applied
    instance.setAttribute('class', 'w-8 h-8 text-blue-500');
    instance.setAttribute('icon', 'tailwind-icon');
    instance.connectedCallback();

    // Light DOM: classes on host element should be accessible
    // In real browser, these would affect the component via CSS cascade
    expect(instance.getAttribute('class')).toBe('w-8 h-8 text-blue-500');
    
    // Verify SVG is rendered in light DOM where Tailwind can reach it
    const svg = instance.querySelector('svg');
    expect(svg).toBeDefined();
  });
});
