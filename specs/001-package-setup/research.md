# Research Findings

## Performance Goals

**Decision**: Target 60 FPS with <1% dropped frames, lightweight SVGs <50KB per icon, use hardware acceleration via CSS transforms and opacity.

**Rationale**: Ensures smooth animations and good user experience in browsers, avoiding layout and paint bottlenecks.

**Alternatives considered**: Lower FPS for simpler animations, but 60 FPS is standard for smooth UX in web components.

## Constraints

**Decision**: Support modern browsers (Chrome 36+, Firefox 16+, Safari 9+), optimize file size by minimizing paths and compressing, ensure accessibility with semantic elements and ARIA labels, integrate seamlessly with TailwindCSS.

**Rationale**: Provides broad compatibility, maintains performance, and ensures usability for all users.

**Alternatives considered**: Limit to specific browsers for advanced features, but broad support is essential for a reusable library.

## Scale/Scope

**Decision**: Start with 200-500 icons, allow growth to 1000+ through community contributions, maintain via GitHub for issues and PRs.

**Rationale**: Balances manageability with growth potential, similar to successful icon libraries like Heroicons and Lucide.

**Alternatives considered**: Smaller initial set for faster development, but growth is key for long-term adoption in design systems.

---

## Phase 0 Research (2025-10-24)

### 1. Bun Build Configuration for ESM-Only Output

**Decision**: Use Bun's bundler for JavaScript output and TypeScript compiler (`tsc`) for type definition generation.

**Rationale**: 
- Bun's bundler is fast and optimized but **does not generate `.d.ts` files** (per documentation)
- TypeScript compiler required for declaration files
- ESM-only output reduces complexity, aligns with modern browser targets
- External package marking prevents bundling node_modules

**Build Configuration**:

```json
{
  "scripts": {
    "build": "bun run build:bundle && bun run build:cli && bun run build:types",
    "build:bundle": "bun build ./src/nova-icon.ts --outfile ./dist/nova-icon.js --format esm --packages external --sourcemap external",
    "build:cli": "bun build ./src/cli/process-svg.ts --outfile ./dist/cli.js --format esm --packages external",
    "build:types": "tsc --emitDeclarationOnly"
  }
}
```

**Alternatives considered**:
- Multiple output formats (ESM + CJS): Rejected - adds complexity
- Preserve directory structure (--no-bundle): Rejected - single file simpler
- External bundler (Rollup, esbuild): Rejected - Bun native sufficient

---

### 2. CLI Design Patterns

**Decision**: Use `cac` for argument parsing and `svgo` + `linkedom` for SVG processing.

**Rationale**:
- **cac**: Lightweight (~3KB), zero dependencies, Bun-compatible
- **svgo**: Industry standard for SVG optimization, plugin-based
- **linkedom**: Full DOM implementation for server-side parsing
- stdin/stdout protocol aligns with constitution CLI requirement

**CLI Architecture**:
```bash
nova-icon <files...> [options]
  --output <file>   Output file (default: stdout)
  --optimize        Optimize SVGs with SVGO
  --json            Output as JSON
```

**Dependencies**:
- `cac`: ^6.7.14 (argument parsing)
- `svgo`: ^4.0.0 (SVG optimization)
- `linkedom`: ^0.18.12 (DOM parsing/manipulation)

**Alternatives considered**:
- commander.js: Rejected - heavier (1.3MB)
- yargs: Rejected - complex API
- Node.js util.parseArgs(): Considered - more manual
- cheerio: Considered - linkedom more complete

---

### 3. Runtime Registration API Pattern

**Decision**: Use **static methods** with **document-level singleton `<svg><defs>`** container.

**Rationale**:
- Static methods enable shared registry across all instances (memory efficient)
- Document-level `<defs>` allows symbol sharing across components
- Prevents duplicate symbol definitions
- Automatic garbage collection
- Aligns with web component best practices

**API Pattern**:
```typescript
class NovaIcon extends HTMLElement {
  static #registry = new Map();
  static #defsContainer = null;
  
  static register(name: string, pathData: string, options?: IconOptions): void {
    const defs = this.getDefsContainer();
    
    // Check for duplicates
    const existing = defs.querySelector(`#${name}`);
    if (existing && !options?.overwrite) return;
    
    if (existing) existing.remove();
    
    const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.id = name;
    symbol.setAttribute('viewBox', options?.viewBox || '0 0 24 24');
    symbol.innerHTML = pathData;
    
    defs.appendChild(symbol);
    this.#registry.set(name, { pathData, options });
  }
  
  static getDefsContainer(): SVGDefsElement {
    if (!this.#defsContainer) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.display = 'none';
      svg.setAttribute('aria-hidden', 'true');
      
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.appendChild(defs);
      document.body.insertBefore(svg, document.body.firstChild);
      
      this.#defsContainer = defs;
    }
    return this.#defsContainer;
  }
}
```

**Alternatives considered**:
- Instance registry: Rejected - duplicates data wastefully
- Shadow DOM per component: Rejected - cannot share symbols
- Append to document.head: Rejected - SVG doesn't work in `<head>`

---

### 4. Configuration File Schema

**Decision**: Use **JSON Schema Draft 2020-12** with **Ajv v8** for **hybrid validation** (build-time + runtime).

**Rationale**:
- Draft 2020-12 is latest stable with best tooling
- Ajv v8: fastest validator, Bun-compatible, standalone code generation
- Hybrid: security + performance (runtime ~5-10KB with compiled schemas)
- TypeScript type generation from schemas
- Rich features: defaults, descriptions, examples

**Schema Structure**:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://nova-icon.orb.zone/schema/config.json",
  "title": "Nova Icon Configuration",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "icons": {
      "type": "object",
      "patternProperties": {
        "^[a-z][a-z0-9-]*$": { "$ref": "#/$defs/icon" }
      }
    }
  },
  "$defs": {
    "icon": {
      "type": "object",
      "required": ["paths"],
      "properties": {
        "paths": {
          "type": "array",
          "items": { "type": "string" },
          "description": "SVG path data for icon layers"
        },
        "viewBox": {
          "type": "string",
          "default": "0 0 24 24"
        },
        "layers": {
          "type": "array",
          "items": { "$ref": "#/$defs/layer" }
        }
      }
    },
    "layer": {
      "type": "object",
      "properties": {
        "weight": { "type": "number", "minimum": 0.1, "default": 1 },
        "opacity": { "type": "number", "minimum": 0, "maximum": 1, "default": 1 },
        "duration": { "type": "number", "minimum": 0, "default": 300 },
        "delay": { "type": "number", "minimum": 0, "default": 0 },
        "stagger": { "type": "number", "minimum": 0, "default": 50 }
      }
    }
  }
}
```

**Dependencies**:
- `ajv`: ^8.12.0 (JSON Schema validator)
- `ajv-formats`: ^3.0.1 (format validators)

**Alternatives considered**:
- Draft-07: Considered - older but more compatible
- JSON Type Definition: Considered - simpler but less expressive
- Runtime-only: Rejected - bundle size impact
- Build-time-only: Rejected - no runtime protection
- Zod/Yup: Rejected - schema-based preferred for documentation

---

### 5. Package.json Best Practices & JSR.io Publishing

**Decision**: ESM-only package published to JSR.io (not npm) with TypeScript source included.

**Key Decisions**:
- **Publish to JSR.io only** (per constitution Distribution & Publishing policy)
- Include TypeScript source files for JSR publication
- TailwindCSS as **optional peer dependency**
- Files whitelist: `src/`, `dist/`, and `contracts/` shipped
- Exports field for main + subpath (schema)
- Bin entry for CLI global install
- Create `jsr.json` configuration file

**JSR.io Benefits**:
- Native TypeScript support (no build step required for consumers)
- Automatic API documentation generation
- ESM-first, modern registry
- Works with npm, pnpm, yarn, bun, and Deno

**Installation methods**:
```bash
# Node.js/Bun
npx jsr add @orb-zone/nova-icon

# Deno
deno add @orb-zone/nova-icon
```

**Publishing**:
```bash
jsr publish
```

**jsr.json configuration**:
```json
{
  "name": "@orb-zone/nova-icon",
  "version": "0.1.0",
  "exports": {
    ".": "./src/nova-icon.ts",
    "./cli": "./src/cli/process-svg.ts",
    "./schema": "./contracts/component-schema.json"
  }
}
```

---

## Summary

All technical unknowns resolved:

1. **Build**: Bun bundler + TypeScript compiler
2. **CLI**: cac + svgo + linkedom  
3. **Runtime API**: Static methods with document-level `<defs>`
4. **Schema**: JSON Schema Draft 2020-12 with Ajv v8
5. **Package**: ESM-only with proper exports and peer dependencies

All decisions align with constitution (Library-First, CLI Interface, Test-First, Simplicity, Distribution & Publishing: JSR.io only) and project constraints (Bun, TypeScript 5, TailwindCSS compatibility).
