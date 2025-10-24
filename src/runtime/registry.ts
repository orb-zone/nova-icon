import type { IconDefinition } from '../types/index.d.ts';

interface IconOptions {
  viewBox?: string;
  overwrite?: boolean;
}

export class NovaIconRegistry {
  private static registry: Map<string, IconDefinition> = new Map();
  private static defsContainer: SVGDefsElement | null = null;

  static getDefsContainer(): SVGDefsElement {
    if (!this.defsContainer) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.display = 'none';
      svg.setAttribute('aria-hidden', 'true');

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.appendChild(defs);
      document.body.insertBefore(svg, document.body.firstChild);

      this.defsContainer = defs;
    }
    return this.defsContainer;
  }

  static register(name: string, pathData: string, options?: IconOptions): void {
    const defs = this.getDefsContainer();

    const existing = defs.querySelector(`#${name}`);
    if (existing && !options?.overwrite) {
      return;
    }

    if (existing) {
      existing.remove();
    }

    const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.id = name;
    symbol.setAttribute('viewBox', options?.viewBox || '0 0 24 24');
    symbol.innerHTML = pathData;

    defs.appendChild(symbol);
    
    this.registry.set(name, {
      name,
      paths: [pathData],
      viewBox: options?.viewBox,
    });
  }

  static registerBatch(definitions: Array<{ name: string; paths: string[]; viewBox?: string }>): void {
    const defs = this.getDefsContainer();
    const fragment = document.createDocumentFragment();

    for (const def of definitions) {
      const existing = defs.querySelector(`#${def.name}`);
      if (existing) {
        existing.remove();
      }

      const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
      symbol.id = def.name;
      symbol.setAttribute('viewBox', def.viewBox || '0 0 24 24');
      symbol.innerHTML = def.paths.join(' ');

      fragment.appendChild(symbol);
      
      this.registry.set(def.name, {
        name: def.name,
        paths: def.paths,
        viewBox: def.viewBox,
      });
    }

    defs.appendChild(fragment);
  }

  static get(name: string): IconDefinition | undefined {
    return this.registry.get(name);
  }

  static has(name: string): boolean {
    return this.registry.has(name);
  }

  static _reset(): void {
    this.registry.clear();
    this.defsContainer = null;
  }
}
