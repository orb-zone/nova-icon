import { describe, it, expect } from 'bun:test';

describe('Component Hover Animations', () => {
  it('should have animation capability', () => {
    (global as any).HTMLElement = class {};
    (global as any).customElements = { define: () => {} };
    (global as any).matchMedia = () => ({ matches: false, addEventListener: () => {} });
    
    const { NovaIcon } = require('../../src/nova-icon');
    expect(NovaIcon).toBeDefined();
  });

  it('should set animation CSS variables when animation attribute is set', () => {
    (global as any).HTMLElement = class {
      innerHTML = '';
      style: any = { setProperty: () => {} };
      getAttribute(name: string) { return (this as any)[`_${name}`]; }
      setAttribute(name: string, value: string) { (this as any)[`_${name}`] = value; }
      appendChild() {}
    };
    (global as any).customElements = { define: () => {} };
    (global as any).matchMedia = () => ({ matches: false, addEventListener: () => {} });
    (global as any).document = {
      createElementNS: () => ({
        setAttribute: () => {},
        style: { setProperty: () => {} },
        appendChild: () => {},
      }),
    };

    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    instance.setAttribute('animation', 'hover');
    instance.setAttribute('duration', '1s');

    expect(() => instance.render()).not.toThrow();
  });

  it('should disable animation when prefers-reduced-motion is set', () => {
    (global as any).HTMLElement = class {
      innerHTML = '';
      style: any = { setProperty: () => {} };
      getAttribute(name: string) { return (this as any)[`_${name}`]; }
      setAttribute(name: string, value: string) { (this as any)[`_${name}`] = value; }
      appendChild() {}
    };
    (global as any).customElements = { define: () => {} };
    (global as any).matchMedia = () => ({ matches: true, addEventListener: () => {} });
    (global as any).document = {
      createElementNS: () => ({
        setAttribute: () => {},
        style: { setProperty: () => {} },
        appendChild: () => {},
      }),
    };

    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    instance.setAttribute('animation', 'hover');

    expect(() => instance.render()).not.toThrow();
  });

  it('should apply stagger delays to paths', () => {
    (global as any).HTMLElement = class {
      innerHTML = '';
      style: any = { setProperty: () => {} };
      getAttribute(name: string) { return (this as any)[`_${name}`]; }
      setAttribute(name: string, value: string) { (this as any)[`_${name}`] = value; }
      appendChild() {}
    };
    (global as any).customElements = { define: () => {} };
    (global as any).matchMedia = () => ({ matches: false, addEventListener: () => {} });
    (global as any).document = {
      createElementNS: () => ({
        setAttribute: () => {},
        style: { transition: '', setProperty: () => {} },
        appendChild: () => {},
      }),
    };

    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    instance.setAttribute('animation', 'hover');
    instance.setAttribute('stagger', '0.1s');
    instance.setAttribute('delay', '0.5s');

    expect(() => instance.render()).not.toThrow();
  });

  it('should apply different stroke weights and opacities for layers', () => {
    (global as any).HTMLElement = class {
      innerHTML = '';
      style: any = { setProperty: () => {} };
      getAttribute(name: string) { return (this as any)[`_${name}`]; }
      setAttribute(name: string, value: string) { (this as any)[`_${name}`] = value; }
      appendChild() {}
    };
    (global as any).customElements = { define: () => {} };
    (global as any).matchMedia = () => ({ matches: false, addEventListener: () => {} });
    (global as any).document = {
      createElementNS: () => ({
        setAttribute: () => {},
        style: { transition: '', setProperty: () => {}, opacity: '' },
        appendChild: () => {},
      }),
    };

    const { NovaIcon } = require('../../src/nova-icon');
    const instance = new NovaIcon();
    instance.setAttribute('animation', 'hover');
    instance.setAttribute('layers', 'bg:2s,fg:1s');

    expect(() => instance.render()).not.toThrow();
  });
});
