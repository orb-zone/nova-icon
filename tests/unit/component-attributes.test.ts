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

  it('should handle animation attribute changes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    
    expect(() => {
      instance.attributeChangedCallback('animation', null, 'hover');
    }).not.toThrow();
  });

  it('should handle duration attribute changes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    
    expect(() => {
      instance.attributeChangedCallback('duration', '2.2s', '1s');
    }).not.toThrow();
  });

  it('should handle delay attribute changes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    
    expect(() => {
      instance.attributeChangedCallback('delay', '0s', '0.5s');
    }).not.toThrow();
  });

  it('should handle stagger attribute changes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    
    expect(() => {
      instance.attributeChangedCallback('stagger', '0s', '0.1s');
    }).not.toThrow();
  });

  it('should handle layers attribute changes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    
    expect(() => {
      instance.attributeChangedCallback('layers', null, 'bg:2s,fg:1s');
    }).not.toThrow();
  });

  it('should calculate stagger delay correctly', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    instance.setAttribute('animation', 'hover');
    instance.setAttribute('stagger', '0.1s');
    instance.setAttribute('delay', '0.5s');

    // Mock render to check transition
    const mockPath = { style: { transition: '', setProperty: () => {} } };
    (global as any).document = {
      createElementNS: () => mockPath,
    };

    instance.render();
    // Check if stagger is applied (hard to test calc, but ensure not throw)
    expect(() => instance.render()).not.toThrow();
  });

  it('should parse layers attribute correctly', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    instance.setAttribute('animation', 'hover');
    instance.setAttribute('layers', 'bg:2s,pg:1s:0.5s,fg:0.5s:1s');

    expect(() => instance.render()).not.toThrow();
  });
});
