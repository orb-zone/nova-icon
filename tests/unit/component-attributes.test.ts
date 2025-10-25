import { describe, it, expect, beforeEach } from 'bun:test';

describe('Component Attributes', () => {
  beforeEach(() => {
    // Light DOM: NovaIcon will render directly to innerHTML, no shadow root
    (global as any).HTMLElement = class {
      innerHTML = '';
      _children: any[] = [];
      style: any = { setProperty: () => {} };
      getAttribute(name: string) { return (this as any)[`_${name}`]; }
      setAttribute(name: string, value: string) { (this as any)[`_${name}`] = value; }
      hasAttribute(name: string) { return !!(this as any)[`_${name}`]; }
      appendChild(child: any) { 
        this._children.push(child);
        return child;
      }
      querySelector(selector: string) {
        return this._children.find(c => c.tagName === selector.toUpperCase());
      }
    };
    (global as any).customElements = { define: () => {} };
    (global as any).matchMedia = () => ({ matches: false, addEventListener: () => {} });
    (global as any).document = {
      createElementNS: () => ({
        tagName: 'SVG',
        setAttribute: () => {},
        setAttributeNS: () => {},
        appendChild: () => {},
        style: { setProperty: () => {}, color: '', display: '' },
      }),
    };
  });

  it('should handle icon attribute changes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    
    // Light DOM: component should render to innerHTML, not shadowRoot
    expect(() => {
      instance.attributeChangedCallback('icon', null, 'test-icon');
    }).not.toThrow();
  });

  it('should handle size attribute changes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    
    expect(() => {
      instance.attributeChangedCallback('size', '24px', '48px');
    }).not.toThrow();
  });

  it('should handle color attribute changes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    
    expect(() => {
      instance.attributeChangedCallback('color', 'black', 'red');
    }).not.toThrow();
  });
});
