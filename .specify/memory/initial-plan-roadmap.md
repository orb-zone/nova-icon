# PLAN.md: Step-by-Step Checklist for Creating @orb-zone/nova-icon Bun Package

This document outlines a step-by-step checklist for developing the `@orb-zone/nova-icon` Bun package. The package provides a reusable web-component for SVG icons with optional animation support, based on patterns from `svg-icon-deep-dive.md` and `concept-example.html`. The component is compatible with Nova Web Components (using Tailwind CSS and CSS custom properties for theming) but does not depend on them, ensuring standalone usability.

The core component focuses on efficient icon rendering via light DOM and shared symbols. Advanced features like stroke-dash animations are demonstrated in examples and can be extended via CSS. The component avoids shadow DOM for seamless Tailwind integration.

---

## Phase 1: Package Setup and Structure ✅ COMPLETED

- [x] Initialize Bun package: Run `bun init` in the project directory to create `package.json`, basic structure, and entry points.
- [x] Update `package.json`:
  - Set name to `@orb-zone/nova-icon`.
  - Add description: "A reusable web-component for SVG icons with optional animations, compatible with Nova Design System."
  - Specify main entry point (e.g., `dist/nova-icon.js`).
  - Add build scripts (e.g., `bun run build` for bundling).
  - Include dependencies: None required for core functionality; optional peer dependencies for Tailwind integration (e.g., `tailwindcss` as peer dep).
  - Add keywords: "web-component", "svg", "icon", "nova", "light-dom".
  - Set license (e.g., MIT).
- [x] Create directory structure:
  - `src/`: Source code (e.g., `nova-icon.ts` for the web-component).
  - `dist/`: Build output.
  - `specs/`: Feature specifications and planning documents.
  - `tests/`: Unit, integration, and contract tests.
  - `examples/`: HTML examples and demos.
- [x] Set up build configuration: Use Bun's bundler to compile TypeScript into ESM for distribution.

---

## Phase 2: Web-Component Implementation ✅ COMPLETED

- [x] Define the custom element: Create `src/nova-icon.ts` as a TypeScript class extending `HTMLElement`.
- [x] Implement core SVG structure:
  - Render SVG directly to light DOM (no shadow DOM for Tailwind compatibility).
  - Use `<use>` elements referencing shared symbols in document-level `<defs>`.
  - Support placeholder rendering for missing icons.
  - Auto-recreate `<defs>` container if removed.
- [x] Add component attributes/props:
  - `icon`: String attribute to select the icon symbol.
  - `size`: CSS size value (default: "24px").
  - `color`: CSS color value (default: "currentColor").
- [x] Handle lifecycle: `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback` for re-rendering on changes.
- [x] Ensure accessibility:
  - Respect `prefers-reduced-motion` media query.
  - Use `currentColor` for stroke inheritance.
  - Support CSS custom property inheritance through light DOM.
- [x] Light DOM refactor: Removed shadow DOM, enabled Tailwind integration, efficient symbol sharing.

---

## Phase 3: Integration and Compatibility with Nova Web Components ✅ COMPLETED

- [x] Adopt Nova theming patterns:
  - Use CSS custom properties for colors and tokens (align with Nova themes).
  - Inherit styles from Tailwind utilities via light DOM (no shadow DOM barriers).
  - Expose variables like `--icon-size` and `--animation-enabled`.
- [x] Make it Tailwind-friendly:
  - Allow Tailwind classes directly on component (e.g., `<nova-icon class="w-16 h-16 text-blue-500">`).
  - Use `currentColor` for stroke inheritance from Tailwind utilities.
  - Optional peer dependency for Tailwind (not enforced).
- [x] Test compatibility:
  - Works alongside other components without conflicts.
  - Standalone operation with fallbacks (no Nova or Tailwind required).
  - Comprehensive examples in `examples/` directory.

---

## Phase 4: Build, Testing, and Distribution ✅ COMPLETED

- [x] Set up build process:
  - Bun bundles `src/nova-icon.ts` into `dist/nova-icon.js` (ESM format).
  - TypeScript definitions generated.
  - Optimized for browser targets.
- [x] Add comprehensive tests:
  - Unit tests (30+ passing) for component and registry.
  - Integration tests for rendering and Tailwind support.
  - Contract tests for API compliance.
  - E2E test structure (disabled, for release validation).
- [x] Create examples:
  - `examples/tailwind-integration.html`: Tailwind utility demos.
  - `examples/animations.html`: SVG stroke-dash animation patterns.
  - `examples/basic-usage.html`: Core component usage.
- [x] Write README.md:
  - Installation and usage instructions.
  - API docs for attributes and properties.
  - Integration guidance for Nova and Tailwind.
- [x] Ready for JSR.io: Package configured for publishing (scoped to @orb-zone).

---

## Phase 5: Advanced Features and Polish

- [x] Performance optimization:
  - Efficient symbol sharing via `<use>` elements (1 definition, N references).
  - Light DOM rendering for minimal overhead.
  - Bundle size optimized (6.42 KB).
- [x] Cross-browser testing: Animations work in modern browsers (Chrome, Firefox, Safari, Edge).
- [x] Accessibility audit: Respects `prefers-reduced-motion`, uses semantic SVG.
- [x] Documentation: Comprehensive AGENTS.md, examples, and specs.

## Phase 6: Animation System (Optional Extension)

- [ ] Extend NovaIcon component with animation props:
  - `animation`: Enable/disable animations (default: false).
  - `duration`: Animation duration (e.g., "2s").
  - `delay`: Start delay (e.g., "0.5s").
  - `stagger`: Stagger delay between paths (e.g., "0.1s").
- [ ] Implement animation rendering:
  - Add `pathLength="1"` to paths when animations enabled.
  - Apply inline transitions on path elements.
  - Use CSS variables on `<use>` for hover triggers.
- [ ] Update examples: Integrate animations into component usage demos.
- [ ] Add animation tests: Verify hover triggers, stagger effects, accessibility.

Note: Animations are currently demonstrated in `examples/animations.html` using raw SVG. Component integration is a future enhancement.

---

## References

- **svg-icon-deep-dive.md**: Core implementation patterns for SVG stroke-dash animations.
- **concept-example.html**: Proof-of-concept for layered icons (referenced in deep-dive).
- **Nova Web Components Docs**: https://nova.eliagroup.io/latest/getting-started/developers/frameworks/web-components-iAGHLFf7 – For theming and Tailwind integration.
- **Web Components Standards**: MDN docs for custom elements and light DOM.
- **specs/002-light-dom-refactor/**: Light DOM refactor specification and implementation.
- **examples/animations.html**: Working animation examples with hover triggers and stagger.

## Summary of Changes from Original Plan

1. **Shadow DOM Removed**: Original plan assumed shadow DOM, but refactor to light DOM was necessary for Tailwind compatibility.
2. **Animations Deferred**: Core component focuses on rendering; animations are demonstrated in examples and can be extended later.
3. **Testing Emphasis**: Comprehensive test suite (42 tests passing) ensures reliability.
4. **MCP Integration**: Added Playwright, Filesystem, Git, and Fetch servers for enhanced AI assistance.
5. **Spec-Driven Development**: Used Speckit workflow for structured feature development.

This updated roadmap reflects the completed light DOM refactor and positions the package for advanced features like animations as optional extensions.
