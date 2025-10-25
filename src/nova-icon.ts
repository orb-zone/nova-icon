import { NovaIconRegistry } from './runtime/registry.ts';

export class NovaIcon extends HTMLElement {
  private _reducedMotion: boolean = false;
  private _shadowRoot: ShadowRoot;

  static get observedAttributes() {
    return ['icon', 'size', 'color'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }
      svg {
        display: block;
      }
    `;
    this._shadowRoot.appendChild(style);

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this._reducedMotion = mediaQuery.matches;

      mediaQuery.addEventListener('change', (e) => {
        this._reducedMotion = e.matches;
        this.render();
      });
    }
  }

  get reducedMotion(): boolean {
    return this._reducedMotion;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    const svgs = this._shadowRoot.querySelectorAll('svg:not(style ~ svg)');
    svgs.forEach(svg => svg.remove());
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  private render() {
    const iconName = this.getAttribute('icon');
    const size = this.getAttribute('size') || '24px';
    const color = this.getAttribute('color') || 'currentColor';

    const existingSvgs = this._shadowRoot.querySelectorAll('svg:not(style ~ svg)');
    existingSvgs.forEach(svg => svg.remove());

    if (!iconName) {
      return;
    }

    const iconDef = NovaIconRegistry.get(iconName);
    if (!iconDef) {
      console.warn(`Icon "${iconName}" not registered`);
      return;
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', iconDef.viewBox || '0 0 24 24');
    svg.style.color = color;

    if (this._reducedMotion) {
      svg.style.setProperty('--animation-enabled', '0');
    } else {
      svg.style.setProperty('--animation-enabled', '1');
    }

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${iconName}`);

    svg.appendChild(use);
    this._shadowRoot.appendChild(svg);
  }
}

if (typeof customElements !== 'undefined') {
  customElements.define('nova-icon', NovaIcon);
}

export { NovaIconRegistry };
