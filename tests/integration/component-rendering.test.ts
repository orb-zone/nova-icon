import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe.skip('Component Rendering with Registered Icons', () => {
  let originalDocument: any;
  let originalCustomElements: any;
  let originalWindow: any;
  let originalHTMLElement: any;

  beforeEach(() => {
    originalDocument = global.document;
    originalCustomElements = (global as any).customElements;
    originalWindow = (global as any).window;
    originalHTMLElement = (global as any).HTMLElement;

    class MockHTMLElement {
      _attributes: Record<string, string> = {};
      _shadowRoot: any = null;
      innerHTML = '';
      style: any = {
        setProperty: () => {},
      };

      getAttribute(name: string) {
        return this._attributes[name];
      }

      setAttribute(name: string, value: string) {
        this._attributes[name] = value;
      }

      appendChild(child: any) {
        return child;
      }

      attachShadow(options: { mode: string }) {
        if (!this._shadowRoot) {
          this._shadowRoot = {
            _children: [] as any[],
            appendChild: (child: any) => {
              this._shadowRoot._children.push(child);
              return child;
            },
            querySelectorAll: (selector: string) => {
              return this._shadowRoot._children.filter((child: any) => {
                if (selector === 'svg:not(style ~ svg)') {
                  return child.tagName === 'SVG';
                }
                return false;
              });
            },
          };
        }
        return this._shadowRoot;
      }
    }

    (global as any).HTMLElement = MockHTMLElement;
    (global as any).customElements = { define: () => { } };
    (global as any).window = {
      matchMedia: () => ({ matches: false, addEventListener: () => { } }),
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
          setAttribute: function (name: string, value: string) {
            (this as any)[name] = value;
          },
          appendChild: function (child: any) {
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

    expect(() => {
      instance.connectedCallback();
    }).not.toThrow();
  });
});
