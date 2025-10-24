# nova-icon Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-23

## Active Technologies
- TypeScript 5 + Bun (runtime, build, test), TailwindCSS (optional peer) (001-package-setup)
- N/A (static assets only) (001-package-setup)

- TypeScript 5 + Bun, TailwindCSS (001-package-setup)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5: Follow standard conventions

## Recent Changes
- 001-package-setup: Added TypeScript 5 + Bun (runtime, build, test), TailwindCSS (optional peer)

- 001-package-setup: Added TypeScript 5 + Bun, TailwindCSS

<!-- MANUAL ADDITIONS START -->

## SVG Animation Best Practices

Based on proof-of-concept research in AGENT.md, follow these guidelines for implementing animated SVG icons in nova-icon:

### Core Animation Pattern
- Use CSS custom properties on `<use>` elements to trigger animations via hover.
- Define transitions inline on path elements for reliable shadow DOM compatibility.
- Normalize paths with `pathLength="1"` for consistent dash animations.
- Avoid direct CSS targeting of paths inside `<use>` elements (unreliable across browsers).

### Key Implementation Rules
- **Variable Inheritance**: CSS variables inherit through shadow DOM boundaries; use this for theming and animation triggers.
- **Property Transitions**: Transition actual CSS properties (e.g., `stroke-dashoffset`), not variables themselves.
- **Stagger Effects**: Use `calc()` in `transition-delay` with `--path-index` for sequential animations.
- **Layer Composition**: Use multiple `<use>` elements for background, playground, and foreground layers with independent timing.
- **Accessibility**: Respect `prefers-reduced-motion` by disabling animations and setting final state.
- **Responsive Design**: Apply `vector-effect: non-scaling-stroke` to maintain consistent stroke widths.

### Theming Integration
- Expose CSS custom properties that align with design system tokens (e.g., Nova's `--nova-color-primary`).
- Use `currentColor` for strokes to inherit from Tailwind utilities or parent styles.
- Ensure standalone operation with fallbacks while enabling seamless integration.

### Common Pitfalls to Avoid
- Do not try to animate CSS variables directly (they are not animatable).
- Do not target paths inside `<use>` with external CSS selectors.
- Always use `stroke-dasharray="1 0"` for continuous lines.
- Set `overflow: visible` on icon SVGs to prevent clipping.

For full implementation details, refer to AGENT.md.

<!-- MANUAL ADDITIONS END -->
