# Implementation Plan: Light DOM Refactor

**Branch**: `002-light-dom-refactor` | **Date**: 2025-10-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-light-dom-refactor/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor NovaIcon web component from shadow DOM to light DOM rendering to enable Tailwind CSS integration and efficient symbol sharing via SVG `<use>` elements. This fixes the primary constraint violation from 001-package-setup and re-enables all skipped component tests.

## Technical Context

**Language/Version**: TypeScript 5  
**Primary Dependencies**: Bun (runtime, build, test), TailwindCSS (optional peer)  
**Storage**: N/A (client-side only)  
**Testing**: Bun's built-in test runner (`bun test`)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - all with SVG `<use>` support)  
**Project Type**: Single web component library  
**Performance Goals**: Maintain 60 FPS animations, <1% dropped frames, efficient symbol sharing (1 definition for N instances)  
**Constraints**: No shadow DOM (Tailwind compatibility), maintain all existing API contracts, zero breaking changes to NovaIconRegistry  
**Scale/Scope**: Single component refactor affecting ~112 lines in src/nova-icon.ts, 6 test files with skipped tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Test-First (NON-NEGOTIABLE)
- **Status**: PASS
- **Rationale**: 6 skipped tests exist from 001-package-setup waiting for this refactor. Tests will be updated to query light DOM, then implementation will follow Red-Green-Refactor cycle.

### ✅ Technology Stack Requirements
- **Status**: PASS
- **Rationale**: TypeScript 5 + Bun + TailwindCSS already established. SVG animations via CSS custom properties and transitions (per best practices).

### ✅ Simplicity
- **Status**: PASS
- **Rationale**: This refactor removes complexity (shadow DOM encapsulation) and simplifies to standard light DOM rendering. No new dependencies or patterns introduced.

### ✅ Integration Testing
- **Status**: PASS
- **Rationale**: Existing integration tests in tests/integration/ cover runtime API. Component rendering tests in tests/integration/component-rendering.test.ts will be re-enabled after refactor.

### ✅ Library-First & CLI Interface
- **Status**: N/A
- **Rationale**: NovaIcon is a client-side web component library. CLI interface principle applies to build tooling (Phase 5 in 001-package-setup roadmap, out of scope for this refactor).

### ✅ Distribution & Publishing
- **Status**: PASS
- **Rationale**: No changes to package structure or JSR.io publishing. This is an internal refactor maintaining API compatibility.

## Project Structure

### Documentation (this feature)

```text
specs/002-light-dom-refactor/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── nova-icon.ts         # REFACTOR: Remove shadow DOM, render to light DOM with <use>
├── runtime/
│   ├── registry.ts      # ENHANCE: Add defs container recreation logic
│   └── validator.ts     # NO CHANGE
└── types/
    └── index.d.ts       # NO CHANGE

tests/
├── unit/
│   ├── component.test.ts                    # UPDATE: Query light DOM instead of shadowRoot
│   ├── component-attributes.test.ts         # RE-ENABLE: Update shadow DOM selectors to light DOM
│   ├── component-accessibility.test.ts      # RE-ENABLE: Update shadow DOM selectors to light DOM
│   ├── registry.test.ts                     # NO CHANGE
│   ├── registry-batch.test.ts               # NO CHANGE
│   ├── registry-duplicates.test.ts          # NO CHANGE
│   ├── schema-validation.test.ts            # NO CHANGE
│   └── schema-validation-errors.test.ts     # NO CHANGE
├── integration/
│   ├── component-rendering.test.ts          # RE-ENABLE: Update to light DOM expectations
│   ├── component-animation.test.ts          # NO CHANGE (already minimal)
│   └── runtime.test.ts                      # NO CHANGE
└── contract/
    ├── api-contract.test.ts                 # NO CHANGE
    └── config-schema.test.ts                # NO CHANGE
```

**Structure Decision**: Single project structure maintained from 001-package-setup. All changes confined to src/nova-icon.ts and test files. No new directories or architectural changes needed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitution checks pass.

---

## Phase 0: Research & Technical Decisions

**Status**: Ready to execute

### Research Tasks

1. **Light DOM Rendering Pattern for Web Components**
   - Research: Best practices for web components that render to light DOM instead of shadow DOM
   - Decision needed: How to preserve component encapsulation without shadow DOM
   - Reference: concept-example.html already validates the pattern

2. **SVG `<use>` Cross-Document References**
   - Research: Browser compatibility and edge cases for SVG `<use>` elements referencing symbols in document-level `<defs>`
   - Decision needed: Confirm all target browsers support this pattern
   - Reference: MDN documentation on SVG `<use>` and browser support matrix

3. **CSS Custom Property Inheritance in Light DOM**
   - Research: How CSS custom properties cascade through light DOM vs shadow DOM
   - Decision needed: Confirm Tailwind utilities and parent CSS variables will inherit naturally
   - Reference: CSS specification on custom property inheritance

4. **innerHTML Re-rendering Performance**
   - Research: Performance implications of re-rendering via innerHTML on attribute changes
   - Decision needed: Whether debouncing or requestAnimationFrame is needed
   - Reference: Web performance best practices for DOM manipulation

5. **Placeholder Icon Design**
   - Research: Standard patterns for placeholder/fallback icons in icon libraries
   - Decision needed: What should the placeholder icon look like (empty box, question mark, generic icon)
   - Reference: Material Icons, Heroicons, Lucide fallback patterns

6. **Test Migration Strategy**
   - Research: Patterns for migrating shadow DOM tests to light DOM tests
   - Decision needed: Whether to use querySelector directly on component or create helper utilities
   - Reference: Existing test suite structure in tests/unit/ and tests/integration/

**Output**: research.md documenting all decisions and rationale

---

## Phase 1: Design & Contracts

**Status**: Pending Phase 0 completion

### Data Model

**File**: data-model.md

**Entities**:

1. **NovaIcon Component State**
   - `icon` attribute: string (icon name)
   - `size` attribute: string (CSS size value, default "24px")
   - `color` attribute: string (CSS color value, default "currentColor")
   - `_reducedMotion` private field: boolean (tracks prefers-reduced-motion)
   - No shadow root (removed)

2. **DOM Structure (Light DOM)**
   - NovaIcon host element contains:
     - Single `<svg>` element as direct child
     - `<use href="#icon-name">` element inside SVG
   - No inline `<style>` element
   - CSS variables applied directly on host element

3. **Shared Defs Container**
   - Maintained by NovaIconRegistry
   - Structure: `<svg style="display:none"><defs>...</defs></svg>`
   - Contains `<symbol id="icon-name">` elements
   - Auto-recreated if removed from DOM

### API Contracts

**File**: contracts/component-api.md

**NovaIcon Component Interface** (unchanged from 001):
- Custom element: `<nova-icon>`
- Observed attributes: `icon`, `size`, `color`
- Lifecycle: `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`
- Public property: `reducedMotion` (readonly boolean)

**NovaIconRegistry API** (unchanged from 001):
- `register(name: string, pathData: string, options?: IconOptions): void`
- `registerBatch(definitions: Array<{name, paths, viewBox}>): void`
- `get(name: string): IconDefinition | undefined`
- `has(name: string): boolean`
- `getDefsContainer(): SVGDefsElement` (enhanced with auto-recreation)

**New Behaviors** (clarified):
- Missing icon: Renders placeholder + console warning
- Attribute change: Re-renders immediately
- Defs container removed: Auto-recreated on next render
- innerHTML cleared: Re-renders on next lifecycle event
- CSS variables: Inherited naturally through light DOM

### Agent Context Update

**Command**: `.specify/scripts/bash/update-agent-context.sh opencode`

**Updates**:
- Add light DOM rendering pattern to AGENTS.md
- Document placeholder icon approach
- Add test migration notes (shadow DOM → light DOM selectors)
- Preserve manual SVG animation best practices section

**Output**: Updated AGENTS.md with new patterns between manual addition markers

### Quickstart

**File**: quickstart.md

**Content**:
- Updated example showing Tailwind classes applied directly to `<nova-icon>`
- Demonstrate CSS custom property inheritance
- Show multiple instances sharing symbols (viewable in DevTools)
- Note: No shadow DOM, styles apply naturally
- Example:
  ```html
  <nova-icon icon="star" class="w-12 h-12 text-blue-500"></nova-icon>
  ```

---

## Phase 2: Task Breakdown

**Status**: NOT EXECUTED (requires `/speckit.tasks` command)

This phase is handled by the `/speckit.tasks` command and generates `tasks.md`.

---

## Next Steps

1. Execute Phase 0: Run research tasks and document decisions in research.md
2. Execute Phase 1: Create data-model.md, update contracts/, generate quickstart.md
3. Run agent context update script
4. Re-validate Constitution Check (expected: all pass)
5. User executes `/speckit.tasks` for Phase 2 task breakdown
