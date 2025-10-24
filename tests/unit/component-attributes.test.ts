import { describe, it, expect, beforeEach } from 'bun:test';

describe('Component Attributes', () => {
  beforeEach(() => {
    (global as any).HTMLElement = class {
      getAttribute(name: string) { return (this as any)[`_${name}`]; }
      setAttribute(name: string, value: string) { (this as any)[`_${name}`] = value; }
    };
    (global as any).customElements = { define: () => {} };
    (global as any).matchMedia = () => ({ matches: false, addEventListener: () => {} });
    (global as any).document = {
      createElementNS: () => ({
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
    instance.innerHTML = '';
    instance.appendChild = () => {};
    
    expect(() => {
      instance.attributeChangedCallback('icon', null, 'test-icon');
    }).not.toThrow();
  });

  it('should handle size attribute changes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    instance.innerHTML = '';
    instance.appendChild = () => {};
    
    expect(() => {
      instance.attributeChangedCallback('size', '24px', '48px');
    }).not.toThrow();
  });

  it('should handle color attribute changes', () => {
    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    instance.innerHTML = '';
    instance.appendChild = () => {};
    
    expect(() => {
      instance.attributeChangedCallback('color', 'black', 'red');
    }).not.toThrow();
  });
});
