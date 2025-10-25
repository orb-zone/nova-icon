import { NovaIconRegistry } from './runtime/registry.ts';

export class NovaIcon extends HTMLElement {
  private _reducedMotion: boolean = false;

  static get observedAttributes() {
    return ['icon', 'size', 'color'];
  }

  constructor() {
    super();

    // Ensure component can be sized properly (inline elements ignore width/height)
    this.style.display = 'inline-block';

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
    // Light DOM: No special cleanup needed, browser handles it
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

    // Set CSS variables on host element
    this.style.setProperty('--icon-size', size);
    
    if (this._reducedMotion) {
      this.style.setProperty('--animation-enabled', '0');
    } else {
      this.style.setProperty('--animation-enabled', '1');
    }

    // Clear existing content (light DOM)
    this.innerHTML = '';

    if (!iconName) {
      return;
    }

    const iconDef = NovaIconRegistry.get(iconName);
    if (!iconDef) {
      // Render placeholder icon with warning
      this.renderPlaceholder();
      console.warn(`[NovaIcon] Icon "${iconName}" not found. Register it via NovaIconRegistry.register()`);
      
      if (typeof window !== 'undefined' && !this.hasAttribute('data-waiting-for-registration')) {
        this.setAttribute('data-waiting-for-registration', 'true');
        window.addEventListener('nova-icons-registered', () => {
          if (this.getAttribute('data-waiting-for-registration') === 'true') {
            this.removeAttribute('data-waiting-for-registration');
            this.render();
          }
        }, { once: true });
      }
      return;
    }

    if (this.hasAttribute('data-waiting-for-registration')) {
      this.removeAttribute('data-waiting-for-registration');
    }

    // Create SVG with <use> element referencing shared symbol
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', iconDef.viewBox || '0 0 24 24');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.color = color;

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#${iconName}`);
    svg.appendChild(use);

    // Append to light DOM
    this.appendChild(svg);
  }

  private renderPlaceholder() {
    // Render placeholder: outlined square with question mark
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.style.width = '100%';
    svg.style.height = '100%';

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '2');
    rect.setAttribute('y', '2');
    rect.setAttribute('width', '20');
    rect.setAttribute('height', '20');
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', 'currentColor');
    rect.setAttribute('stroke-width', '2');
    svg.appendChild(rect);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '12');
    text.setAttribute('y', '16');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'currentColor');
    text.setAttribute('font-size', '14');
    text.textContent = '?';
    svg.appendChild(text);

    this.appendChild(svg);
  }
}

if (typeof customElements !== 'undefined') {
  customElements.define('nova-icon', NovaIcon);
}

export { NovaIconRegistry };
