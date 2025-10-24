# PLAN.md: Step-by-Step Checklist for Creating @orb-zone/nova-icon Bun Package

This document outlines a step-by-step checklist for developing the `@orb-zone/nova-icon` Bun package. The package will provide a reusable web-component for animated SVG icons, based on the patterns and proof-of-concept in `AGENT.md` and `example.html`. The component will be compatible with Nova Web Components (using Tailwind CSS and CSS custom properties for theming) but will not depend on them, ensuring standalone usability.

The web-component will encapsulate the layered SVG stroke-dash animation system, allowing for customizable icons with hover-triggered animations, stagger effects, and accessibility features.

---

## Phase 1: Package Setup and Structure

- [x] Initialize Bun package: Run `bun init` in the project directory to create `package.json`, basic structure, and entry points.
- [x] Update `package.json`:
  - Set name to `@orb-zone/nova-icon`.
  - Add description: "A reusable web-component for animated SVG icons compatible with Nova Design System."
  - Specify main entry point (e.g., `dist/nova-icon.js`).
  - Add build scripts (e.g., `bun run build` for bundling).
  - Include dependencies: None required for core functionality; optional peer dependencies for Tailwind integration (e.g., `tailwindcss` as peer dep).
  - Add keywords: "web-component", "svg", "animation", "nova", "icon".
  - Set license (e.g., MIT).
- [x] Create directory structure:
  - `src/`: Source code (e.g., `nova-icon.ts` for the web-component).
  - `dist/`: Build output.
  - `assets/`: SVG symbols, filters, and any static assets (e.g., `icons.svg` for symbol definitions).
  - `tests/`: Unit tests for the component.
  - `docs/`: Documentation and examples.
- [x] Set up build configuration: Use Bun's bundler or a tool like Rollup/Vite to bundle the TypeScript into a single JS file for distribution.

---

## Phase 2: Web-Component Implementation

- [ ] Define the custom element: Create `src/nova-icon.ts` as a TypeScript class extending `HTMLElement` (e.g., `class NovaIcon extends HTMLElement`).
- [ ] Implement core SVG structure:
  - Embed or reference SVG symbols from `assets/icons.svg` (based on `example.html` patterns: star, sun-rays, etc.).
  - Use `<defs>` for reusable filters (e.g., glow filter) and symbols.
  - Create layered `<use>` elements for background, playground, and foreground layers.
  - Apply `pathLength="1"` to all paths for normalized animations.
- [ ] Integrate animation patterns from `AGENT.md`:
  - Use CSS custom properties (e.g., `--dash-offset`, `--draw-duration`) on `<use>` elements.
  - Define inline transitions on path elements (e.g., `style="transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);"`).
  - Implement stagger effects with `--path-index` and `calc()` for delays.
  - Add hover trigger: `svg.icon:hover use { --dash-offset: 0; }`.
- [ ] Add component attributes/props:
  - `icon`: String attribute to select the icon symbol (e.g., "star", "sun-rays").
  - `size`: Number/string for icon size (e.g., "240px").
  - `color`: String for theme color (e.g., "gold").
  - `layers`: JSON string or object for layer configurations (weight, opacity, duration, delay, stagger).
- [ ] Handle lifecycle: Use `connectedCallback` to render the SVG and attach styles; `attributeChangedCallback` for prop updates.
- [ ] Ensure accessibility:
  - Add `aria-label` or `title` for screen readers.
  - Respect `prefers-reduced-motion` media query to disable animations.
  - Use `vector-effect: non-scaling-stroke` for consistent stroke widths.

---

## Phase 3: Integration and Compatibility with Nova Web Components

- [ ] Adopt Nova theming patterns:
  - Use CSS custom properties for colors, spacing, and other tokens (align with Spark/Ocean themes from Nova docs).
  - Ensure the component can inherit styles from Tailwind utilities (e.g., via `currentColor` for strokes).
  - Avoid shadow DOM for styling to allow Tailwind classes to flow in (as per Nova Web Components guidelines).
- [ ] Make it Tailwind-friendly:
  - Expose CSS variables that map to Tailwind scales (e.g., `--line-color: var(--nova-color-primary)`).
  - Allow users to apply Tailwind classes to the component (e.g., `<nova-icon class="w-16 h-16 text-blue-500">`).
  - Do not enforce Tailwind as a dependency; make it optional via peer dependencies.
- [ ] Test compatibility:
  - Ensure the component works alongside Nova components (e.g., nv-button) without conflicts.
  - Verify theming integration: Import Nova tokens (spark.css or ocean.css) in examples and confirm variable inheritance.
- [ ] Standalone operation: Confirm the component functions without Nova or Tailwind (fallback to default styles).

---

## Phase 4: Build, Testing, and Distribution

- [ ] Set up build process:
  - Use Bun to bundle `src/nova-icon.ts` into `dist/nova-icon.js`.
  - Minify and optimize for production.
  - Generate TypeScript definitions (`.d.ts`) for the component.
- [ ] Add unit tests:
  - Use a testing framework like Jest or Vitest.
  - Test rendering, attribute changes, animation triggers, and accessibility features.
  - Mock DOM for headless testing.
- [ ] Create examples:
  - Build demo HTML files in `docs/` showing standalone usage and integration with Nova/Tailwind.
  - Include code snippets for common use cases (e.g., basic icon, layered animations).
- [ ] Write README.md:
  - Installation instructions (e.g., `bun add @orb-zone/nova-icon`).
  - Usage examples with and without Nova.
  - API documentation for attributes and CSS variables.
  - Link to Nova Web Components docs for integration guidance.
- [ ] Publish to JSR.io: Run `bun run build`, then `jsr publish` (ensure package is scoped correctly to @orb-zone).

---

## Phase 5: Polish and Validation

- [ ] Performance optimization:
  - Lazy-load SVG assets if needed.
  - Minimize bundle size.
  - Test on various devices and browsers (Chrome, Firefox, Safari, mobile).
- [ ] Cross-browser testing: Ensure animations work reliably (focus on modern browsers as per `AGENT.md`).
- [ ] Accessibility audit: Use tools like axe-core to verify compliance.
- [ ] Gather feedback: Share with team for review and iterate based on Nova integration tests.
- [ ] Versioning: Follow semantic versioning for releases.

---

## References

- **AGENT.md**: Core implementation patterns for SVG animations.
- **example.html**: Proof-of-concept for layered icons.
- **Nova Web Components Docs**: https://nova.eliagroup.io/latest/getting-started/developers/frameworks/web-components-iAGHLFf7 – For theming and Tailwind integration.
- **Web Components Standards**: MDN docs for custom elements and shadow DOM.

This checklist ensures a robust, compatible, and reusable package. Mark tasks as complete as you progress.
