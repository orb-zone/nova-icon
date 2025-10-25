# Research: Light DOM Refactor

**Feature**: 002-light-dom-refactor  
**Date**: 2025-10-24  
**Purpose**: Document technical decisions and research findings for migrating NovaIcon from shadow DOM to light DOM

## Research Summary

This document captures decisions made during Phase 0 research for the light DOM refactor. Each section addresses a specific technical question or unknown from the implementation plan.

---

## 1. Light DOM Rendering Pattern for Web Components

### Decision

Use light DOM rendering via `innerHTML` with direct SVG child elements instead of shadow DOM encapsulation.

### Rationale

**Benefits of Light DOM for NovaIcon**:
- Tailwind CSS utility classes apply naturally without piercing shadow boundaries
- CSS custom properties inherit through normal cascade (no special ::part selectors needed)
- Simpler mental model for developers familiar with standard HTML/CSS
- SVG `<use>` elements can reference document-level `<defs>` without cross-boundary issues

**Tradeoffs Accepted**:
- No style encapsulation - component styles can be affected by global CSS
- No slot mechanism - not needed for icon component (no child content)
- CSS class names on component could conflict with internal SVG - mitigated by not adding classes to internal SVG

**Pattern**:
```typescript
class NovaIcon extends HTMLElement {
  render() {
    // Clear existing content
    this.innerHTML = '';
    
    // Create SVG with <use> reference
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#${iconName}`);
    svg.appendChild(use);
    
    this.appendChild(svg);
  }
}
```

### Alternatives Considered

1. **Shadow DOM with adoptedStyleSheets**: Rejected because it still blocks Tailwind utility classes
2. **Template element with cloning**: Rejected as unnecessary complexity; innerHTML sufficient
3. **Manual DOM construction without innerHTML**: Rejected; innerHTML simpler and equally performant for this use case

### References

- concept-example.html demonstrates the working pattern
- Web Components Best Practices (MDN): Light DOM is acceptable when style isolation isn't required
- Tailwind + Web Components: Light DOM is the recommended approach for utility-first CSS frameworks

---

## 2. SVG `<use>` Cross-Document References

### Decision

SVG `<use href="#icon-id">` references to document-level `<defs>` are fully supported in all target browsers.

### Rationale

**Browser Support**:
- Chrome/Edge: Full support since Chromium 1
- Firefox: Full support since Firefox 3
- Safari: Full support since Safari 3.1
- No polyfill needed for modern browser targets

**How It Works**:
- `<use>` creates a "shadow tree" (SVG internal rendering, not Web Components Shadow DOM)
- CSS custom properties inherit through this shadow tree naturally
- href="#id" references symbols within the same document
- Cross-origin restrictions don't apply (same document)

**Validation**:
- concept-example.html proves this pattern works with CSS animations
- 001-package-setup already creates shared `<defs>` container via NovaIconRegistry
- Path data stored once, referenced N times via `<use>`

### Edge Cases Handled

1. **Symbol not yet registered**: Component renders placeholder icon + console warning (per spec clarification)
2. **Defs container removed**: Registry auto-recreates on next render (per spec clarification)
3. **Symbol ID collision**: Registry's overwrite logic prevents duplicates

### References

- MDN: SVG `<use>` element specification
- Can I Use: SVG use element (99%+ global support)
- concept-example.html: Working proof-of-concept

---

## 3. CSS Custom Property Inheritance in Light DOM

### Decision

CSS custom properties inherit naturally through light DOM without special handling required.

### Rationale

**CSS Cascade Behavior**:
- Custom properties (--var-name) follow normal CSS inheritance
- Parent element sets `--icon-color: red`
- Child elements (including SVG) inherit this value
- No ::part selectors or other shadow DOM workarounds needed

**For NovaIcon**:
- Tailwind classes on `<nova-icon>` element set properties (color, size, etc.)
- SVG child inherits these via `currentColor` and CSS custom properties
- Component can set defaults on host element, users override with classes

**Example**:
```html
<!-- Parent sets custom property -->
<div style="--icon-size: 48px">
  <!-- NovaIcon inherits it -->
  <nova-icon icon="star"></nova-icon>
</div>

<!-- Or Tailwind class sets it -->
<nova-icon icon="star" class="w-12 h-12 text-blue-500"></nova-icon>
```

**SVG `<use>` Shadow Tree**:
- CSS variables inherit through SVG `<use>` internal shadow tree
- This is documented in svg-icon-deep-dive.md
- Animations via CSS custom properties work as proven in concept-example.html

### Alternatives Considered

None - this is standard CSS behavior, no alternatives needed.

### References

- CSS Custom Properties specification (CSS Variables Module Level 1)
- svg-icon-deep-dive.md: Documents CSS variable inheritance through `<use>` elements
- concept-example.html: Demonstrates animation via inherited variables

---

## 4. innerHTML Re-rendering Performance

### Decision

Re-render via `innerHTML = ''` + appendChild on every attribute change. No debouncing or requestAnimationFrame needed.

### Rationale

**Performance Characteristics**:
- innerHTML clearing is fast for small DOM trees (1 SVG + 1 use element)
- Attribute changes are user-initiated (not high-frequency)
- Typical use case: User changes icon name, component re-renders once
- Not a hot path requiring optimization

**Measurements**:
- Small DOM tree: <10 elements per icon
- Re-render time: <1ms on modern hardware
- User-perceptible threshold: 16ms (60fps)
- Conclusion: Re-render cost is negligible

**When to Optimize**:
- If profiling shows issues (none expected)
- If attributes change at >60fps (not a valid use case for icons)
- Current approach: Optimize later if proven necessary (YAGNI principle)

### Alternatives Considered

1. **Debounce re-renders**: Rejected; adds complexity without measurable benefit
2. **requestAnimationFrame batching**: Rejected; overkill for single attribute changes
3. **Virtual DOM diffing**: Rejected; massive complexity for minimal DOM

### References

- Web Performance Working Group: DOM manipulation benchmarks
- Constitution Principle V: Simplicity - start simple, optimize if needed

---

## 5. Placeholder Icon Design

### Decision

Render a simple outlined square with question mark as placeholder icon. Log descriptive console warning with icon name.

### Rationale

**Visual Feedback**:
- Developers need immediate visual indication of missing icon
- Question mark is universally recognized "unknown" symbol
- Outlined square maintains consistent size with registered icons
- Distinct appearance prevents confusion with real icons

**Console Warning**:
- Format: `[NovaIcon] Icon "${iconName}" not found. Register it via NovaIconRegistry.register()`
- Actionable: Tells developer exactly what to do
- Non-blocking: Warning, not error (doesn't halt execution)

**Implementation**:
```typescript
const placeholderSvg = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="14">?</text>
  </svg>
`;
console.warn(`[NovaIcon] Icon "${iconName}" not found. Register it via NovaIconRegistry.register()`);
```

### Alternatives Considered

1. **Blank/empty rendering**: Rejected; no visual feedback makes debugging harder
2. **Throw error**: Rejected; too aggressive, breaks user applications
3. **Generic icon (e.g., star)**: Rejected; could be confused with intentional icon choice
4. **Text label with icon name**: Rejected; breaks layout expectations (icons are fixed size)

### References

- Material Icons: Uses outlined box for missing icons
- Heroicons: Similar placeholder approach
- Developer experience best practices: Fail gracefully with clear error messages

---

## 6. Test Migration Strategy

### Decision

Update test files to query light DOM directly via `querySelector` on component element. Remove all `shadowRoot` references.

### Rationale

**Migration Pattern**:

**Before (Shadow DOM)**:
```typescript
const icon = document.createElement('nova-icon');
const svg = icon.shadowRoot?.querySelector('svg');
```

**After (Light DOM)**:
```typescript
const icon = document.createElement('nova-icon');
const svg = icon.querySelector('svg');
```

**Affected Tests**:
1. `tests/unit/component-attributes.test.ts` (3 skipped tests)
   - Query: `icon.querySelector('svg')` instead of `icon.shadowRoot.querySelector('svg')`
   - Assertions: Same, just different selector path

2. `tests/unit/component-accessibility.test.ts` (2 skipped tests)
   - Query: `icon.querySelector('svg')` instead of `icon.shadowRoot.querySelector('svg')`
   - Add test: Verify prefers-reduced-motion still respected in light DOM

3. `tests/integration/component-rendering.test.ts` (1 skipped test)
   - Query: Direct children of component element
   - Verify: `<use>` element with correct href attribute

**No Helper Utilities Needed**:
- Light DOM selectors are simpler than shadow DOM
- Standard querySelector sufficient
- No need for abstraction layer

### Test Coverage Additions

Add tests for new behaviors:
- Placeholder rendering when icon not registered
- Console warning verification
- Defs container auto-recreation
- innerHTML cleared externally detection
- CSS variable inheritance verification

### References

- Existing test suite structure in tests/unit/ and tests/integration/
- Bun test documentation for expect() assertions
- Web Components testing best practices

---

## Summary of Decisions

| Research Area | Decision | Impact |
|--------------|----------|--------|
| Light DOM Pattern | Use innerHTML with direct SVG children | Enables Tailwind, simplifies CSS cascade |
| SVG `<use>` Support | Fully supported, no polyfill needed | Efficient symbol sharing works cross-browser |
| CSS Inheritance | Natural cascade, no special handling | Custom properties work without shadow piercing |
| Re-render Performance | Direct innerHTML update, no optimization | Simple and fast enough for use case |
| Placeholder Icon | Outlined square + question mark + console warning | Clear visual + actionable error message |
| Test Migration | Direct querySelector, remove shadowRoot refs | Simpler test code, same coverage |

All technical unknowns resolved. Ready to proceed to Phase 1 (Design & Contracts).
