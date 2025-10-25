import { NovaIconRegistry } from './runtime/registry.ts';

export class NovaIcon extends HTMLElement {
  private _reducedMotion: boolean = false;

  static get observedAttributes() {
    return ['icon', 'size', 'color', 'animation', 'duration', 'delay', 'stagger', 'layers'];
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
    this.addEventListeners();
  }

  private addEventListeners() {
    if (this.getAttribute('animation') === 'hover') {
      this.addEventListener('mouseenter', this.onHoverStart.bind(this));
      this.addEventListener('mouseleave', this.onHoverEnd.bind(this));
    }
  }

  private onHoverStart() {
    if (!this._reducedMotion) {
      this.querySelectorAll('path').forEach(path => {
        (path as any).style.strokeDashoffset = '0';
      });
    }
  }

  private onHoverEnd() {
    this.querySelectorAll('path').forEach(path => {
      (path as any).style.strokeDashoffset = '1';
    });
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
    const animation = this.getAttribute('animation');
    const duration = this.getAttribute('duration') || '2.2s';
    const delay = this.getAttribute('delay') || '0s';
    const stagger = this.getAttribute('stagger') || '0s';
    const layers = this.getAttribute('layers') || '';

    // Set CSS variables on host element
    this.style.setProperty('--icon-size', size);
    this.style.setProperty('--transition-duration', duration);
    this.style.setProperty('--transition-delay', delay);
    this.style.setProperty('--stagger-amount', stagger);

    // Parse layers
    if (layers != null) {
      const layerParts = layers.split(',').map(l => l.trim().split(':'));
      if (layerParts.length > 0 && layerParts[0]!.length >= 2) {
        const firstLayer = layerParts[0]!;
        this.style.setProperty('--layer-duration', firstLayer[1] || duration);
        this.style.setProperty('--layer-delay', firstLayer[2] || delay);
      }
    }

    if (this._reducedMotion || !animation) {
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

    // Create SVG with paths directly for animation support
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', iconDef.viewBox || '0 0 24 24');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.color = color;
    svg.style.setProperty('vector-effect', 'non-scaling-stroke');

    // Add paths with normalization for animations
    iconDef.paths.forEach((pathData, index) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      // Extract d attribute from pathData string
      const dMatch = pathData.match(/d="([^"]*)"/);
      const dValue = dMatch ? dMatch[1] : '';
      path.setAttribute('d', dValue || '');
      path.setAttribute('pathLength', '1');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('fill', 'none');

      // Different stroke weights and opacities for layers
      const layerIndex = index % 3;
      const strokeWidths: string[] = ['1', '2', '3'];
      const opacities: string[] = ['0.5', '0.7', '1'];
      path.setAttribute('stroke-width', strokeWidths[layerIndex]!);
      path.style.opacity = opacities[layerIndex]!;

      path.style.strokeDasharray = '1 0';
      path.style.strokeDashoffset = '1';
      const staggerDelay = `calc(var(--transition-delay) + ${index} * var(--stagger-amount))`;
      path.style.transition = `stroke-dashoffset var(--transition-duration) ease-in-out ${staggerDelay}`;
      path.style.setProperty('--path-index', index.toString());
      svg.appendChild(path);
    });

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
