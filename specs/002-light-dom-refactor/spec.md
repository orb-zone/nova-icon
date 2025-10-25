# Feature Specification: Light DOM Refactor

**Feature Branch**: `002-light-dom-refactor`  
**Created**: 2025-10-24  
**Status**: Draft  
**Input**: User description: "light-dom-refactor"

## Clarifications

### Session 2025-10-24

- Q: When a NovaIcon references a symbol that hasn't been registered yet, what should happen? → A: Render placeholder icon with warning in console
- Q: How should the component handle re-rendering when attributes change after initial render? → A: Re-render immediately on attribute change (update innerHTML)
- Q: What should happen if the shared `<defs>` container is removed from the DOM? → A: Registry recreates container automatically on next render
- Q: How should the component behave if its `innerHTML` is cleared externally? → A: Detect and re-render on next lifecycle event
- Q: What should happen when CSS variables are inherited from parent elements in light DOM? → A: Component respects inherited CSS variables naturally

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Icon Rendering with Tailwind Classes (Priority: P1)

Developers can apply Tailwind utility classes directly to NovaIcon components and have them affect the SVG rendering without shadow DOM barriers.

**Why this priority**: This is the core constraint violation that blocks Tailwind integration and is explicitly documented as technical debt from 001-package-setup. Without this, the component fails its primary design requirement.

**Independent Test**: Can be fully tested by adding Tailwind classes like `text-red-500 w-8 h-8` to a NovaIcon component and verifying they apply to the rendered SVG, delivering immediate Tailwind compatibility.

**Acceptance Scenarios**:

1. **Given** a NovaIcon component in an HTML document, **When** Tailwind utility classes are applied to the component element, **Then** the classes affect the rendered SVG styling (color, size, transforms, etc.)
2. **Given** a NovaIcon component with `class="w-12 h-12 text-blue-600"`, **When** the component renders, **Then** the SVG is 48x48px and stroke color is blue
3. **Given** multiple NovaIcon instances with different Tailwind classes, **When** they render, **Then** each instance displays with its unique styling without interference

---

### User Story 2 - Efficient Symbol Sharing via `<use>` (Priority: P2)

Developers can register multiple icon definitions once and reference them efficiently across many component instances without duplicating SVG path data.

**Why this priority**: This delivers the performance benefit of shared symbols and fixes the current inefficient path inlining. Critical for applications with many icon instances.

**Independent Test**: Can be tested by registering one icon and rendering it 100 times, verifying that path data appears only once in the shared `<defs>` container and each component uses `<use href="#icon-name">`.

**Acceptance Scenarios**:

1. **Given** an icon registered via NovaIconRegistry, **When** multiple NovaIcon components reference that icon, **Then** the SVG path data appears only once in the document's shared `<defs>` container
2. **Given** a NovaIcon component, **When** it renders, **Then** it contains an `<svg>` element with a `<use>` element pointing to the shared symbol (e.g., `<use href="#icon-checkmark">`)
3. **Given** 100 instances of the same icon, **When** inspecting the DOM, **Then** the path data exists once in `<defs>` and 100 `<use>` references point to it

---

### User Story 3 - Re-enable Skipped Component Tests (Priority: P3)

All component tests that were skipped due to shadow DOM assumptions now pass with light DOM implementation.

**Why this priority**: Ensures test coverage is complete and validates that the refactor maintains all expected component behaviors while fixing the architecture.

**Independent Test**: Can be tested by running the test suite and verifying that all previously skipped tests (component-attributes.test.ts, component-accessibility.test.ts, component-rendering.test.ts) now pass.

**Acceptance Scenarios**:

1. **Given** the light DOM refactor is complete, **When** running `bun test`, **Then** all 6 previously skipped component tests pass
2. **Given** tests that query for shadow DOM elements, **When** updated to query light DOM, **Then** they find and verify the expected SVG elements
3. **Given** the complete test suite, **When** running all tests, **Then** 0 tests are skipped and all tests pass

---

### Edge Cases

- When a NovaIcon references a symbol that hasn't been registered yet, component renders a placeholder icon and logs a warning to console
- When attributes change after initial render (name, size, color), component re-renders immediately by updating innerHTML
- If the shared `<defs>` container is removed from the DOM, NovaIconRegistry automatically recreates it on next component render
- If component's innerHTML is cleared externally, component detects and re-renders on next lifecycle event (reconnection or attribute change)
- CSS variables inherited from parent elements in light DOM are respected naturally by the component's SVG content

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: NovaIcon component MUST render SVG content directly to light DOM (not shadow DOM)
- **FR-002**: NovaIcon component MUST use `<use href="#icon-name">` elements to reference shared symbols in the `<defs>` container
- **FR-003**: NovaIcon component MUST NOT call `attachShadow()` or create shadow roots
- **FR-004**: NovaIcon component MUST render an `<svg>` element as direct child content via `this.innerHTML`
- **FR-005**: Tailwind CSS utility classes applied to NovaIcon elements MUST affect the rendered SVG styling
- **FR-006**: Component MUST apply CSS custom properties (variables) on the host element, not in isolated shadow scope
- **FR-017**: Component MUST respect CSS custom properties inherited from parent elements through natural light DOM CSS cascade
- **FR-007**: Component MUST remove any inline `<style>` elements that were used for shadow DOM encapsulation
- **FR-008**: Previously skipped component tests MUST be updated to query light DOM instead of shadow DOM
- **FR-009**: All 6 skipped tests (component-attributes, component-accessibility, component-rendering) MUST pass after refactor
- **FR-010**: Component lifecycle methods (connectedCallback, disconnectedCallback, attributeChangedCallback) MUST continue to function with light DOM rendering
- **FR-014**: Component MUST re-render immediately when observed attributes change, updating innerHTML with new SVG content
- **FR-016**: Component MUST detect when innerHTML is cleared externally and re-render on next lifecycle event
- **FR-011**: Icon SVG path data MUST appear only once in the shared `<defs>` container per unique icon
- **FR-015**: NovaIconRegistry MUST automatically recreate the shared `<defs>` container if it is removed from the DOM
- **FR-012**: Multiple instances of the same icon MUST reference the same shared symbol, not duplicate path data
- **FR-013**: Component MUST render a placeholder icon and log a console warning when referencing an unregistered symbol

### Key Entities

- **NovaIcon Component**: Web component that renders SVG icons in light DOM using `<use>` references
- **Shared Defs Container**: Document-level `<svg><defs>` container holding icon `<symbol>` definitions
- **Symbol Reference**: `<use href="#icon-id">` element that references a shared symbol

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All Tailwind utility classes applied to NovaIcon components successfully style the rendered SVG elements
- **SC-002**: Icon path data appears exactly once per unique icon in the DOM regardless of number of instances
- **SC-003**: All 6 previously skipped component tests pass with 0 failures
- **SC-004**: Test suite shows 0 skipped tests when running `bun test`
- **SC-005**: Rendering 100 instances of the same icon results in 1 symbol definition and 100 `<use>` references (verified by DOM inspection)
- **SC-006**: Component continues to respond to attribute changes (name, size, color) with light DOM rendering

## Dependencies & Assumptions *(mandatory)*

### Dependencies

- Depends on NovaIconRegistry API from 001-package-setup
- Depends on existing test suite structure
- Depends on shared `<defs>` container pattern established in 001

### Assumptions

- Test expectations currently written for shadow DOM selectors can be migrated to light DOM selectors
- Tailwind utility classes will work with light DOM without requiring additional configuration
- CSS custom properties will inherit naturally through light DOM
- concept-example.html proof-of-concept validates the light DOM + `<use>` pattern works
- No breaking changes to public API (NovaIconRegistry methods remain unchanged)
- Browser support for SVG `<use>` elements is sufficient (all modern browsers)

## Out of Scope

- Adding new animation capabilities (focus is on fixing architecture, not adding features)
- Changing the NovaIconRegistry API
- Adding new icons or icon definitions
- Implementing build-time CLI tooling
- Adding CSS-in-JS solutions for styling
- Creating fallback mechanisms for browsers without `<use>` support
- Performance optimizations beyond efficient symbol sharing (already covered by `<use>` pattern)
- Accessibility improvements beyond maintaining current prefers-reduced-motion support
