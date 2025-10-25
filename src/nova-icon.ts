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
        width: var(--icon-size, 24px);
        height: var(--icon-size, 24px);
      }
      svg {
        display: block;
        width: 100%;
        height: 100%;
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

    this.style.setProperty('--icon-size', size);

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
    svg.setAttribute('viewBox', iconDef.viewBox || '0 0 24 24');
    svg.style.color = color;

    if (this._reducedMotion) {
      svg.style.setProperty('--animation-enabled', '0');
    } else {
      svg.style.setProperty('--animation-enabled', '1');
    }

    const pathData = iconDef.paths.join(' ');
    if (pathData.trim().startsWith('<')) {
      svg.innerHTML = pathData;
    } else {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '2');
      svg.appendChild(path);
    }
    this._shadowRoot.appendChild(svg);
  }
}

if (typeof customElements !== 'undefined') {
  customElements.define('nova-icon', NovaIcon);
}

export { NovaIconRegistry };
