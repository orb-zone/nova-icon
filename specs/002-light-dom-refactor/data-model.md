# Data Model: Light DOM Refactor

**Feature**: 002-light-dom-refactor  
**Date**: 2025-10-24  
**Purpose**: Document component state, DOM structure, and data relationships for light DOM implementation

---

## Overview

This refactor changes how NovaIcon renders but maintains the same external API and data structures. The primary change is eliminating shadow DOM and rendering directly to light DOM with `<use>` references.

---

## Component State

### NovaIcon Component

**Element**: Custom element `<nova-icon>`

**Observed Attributes** (unchanged):
- `icon`: string - Name of the icon to render (references symbol ID in shared defs)
- `size`: string - CSS size value (default: "24px")
- `color`: string - CSS color value (default: "currentColor")

**Private Fields**:
```typescript
{
  _reducedMotion: boolean  // Tracks prefers-reduced-motion media query
  // REMOVED: _shadowRoot (no longer needed)
}
```

**Public Properties** (readonly):
```typescript
{
  reducedMotion: boolean  // Getter for _reducedMotion
}
```

**Lifecycle Methods** (unchanged):
- `constructor()`: Initialize component, set up media query listener
- `connectedCallback()`: Called when added to DOM, triggers initial render
- `disconnectedCallback()`: Called when removed from DOM, cleanup if needed
- `attributeChangedCallback(name, oldValue, newValue)`: Called on attribute change, triggers re-render

**State Transitions**:
```
[Created] → constructor() → [Initialized]
[Initialized] → connectedCallback() → [Connected + Rendered]
[Connected] → attributeChangedCallback() → [Re-rendered]
[Connected] → disconnectedCallback() → [Disconnected]
```

---

## DOM Structure

### Light DOM Rendering (NEW)

**NovaIcon Element Structure**:
```html
<nova-icon icon="star" size="24px" color="currentColor">
  <!-- Light DOM children (rendered via innerHTML/appendChild) -->
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <use href="#star"></use>
  </svg>
</nova-icon>
```

**CSS Variables on Host**:
```css
nova-icon {
  --icon-size: 24px;          /* Set by component based on size attribute */
  --animation-enabled: 1;      /* 0 if prefers-reduced-motion, 1 otherwise */
}
```

**When Icon Not Registered** (Placeholder):
```html
<nova-icon icon="missing">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="14">?</text>
  </svg>
</nova-icon>
```

**Comparison with Shadow DOM (REMOVED)**:
```html
<!-- OLD (shadow DOM - being removed) -->
<nova-icon icon="star">
  #shadow-root
    <style>...</style>
    <svg>
      <!-- Paths inlined here -->
    </svg>
</nova-icon>

<!-- NEW (light DOM) -->
<nova-icon icon="star">
  <svg>
    <use href="#star"></use>
  </svg>
</nova-icon>
```

---

## Shared Defs Container

### Structure

**Location**: Document body (first child)

**DOM**:
```html
<svg style="display: none" aria-hidden="true">
  <defs>
    <symbol id="star" viewBox="0 0 24 24">
      <!-- SVG paths for star icon -->
    </symbol>
    <symbol id="sun" viewBox="0 0 24 24">
      <!-- SVG paths for sun icon -->
    </symbol>
  </defs>
</svg>
```

**Managed By**: NovaIconRegistry

**Creation**:
- Created on first `register()` call if not present
- Auto-recreated if removed from DOM (new behavior per clarifications)

**Lifecycle**:
```
[Not Exists] → register() → [Created + Inserted]
[Exists] → register() → [Symbol Added/Updated]
[Exists + Removed] → register() → [Recreated + Symbol Added]
```

---

## Registry Data Structure

### NovaIconRegistry (unchanged interface, enhanced implementation)

**Internal State**:
```typescript
{
  registry: Map<string, IconDefinition>  // In-memory cache
  defsContainer: SVGDefsElement | null   // Reference to <defs> element
}
```

**IconDefinition Type** (unchanged):
```typescript
{
  name: string        // Unique identifier
  paths: string[]     // SVG path data
  viewBox?: string    // Optional viewBox (default: "0 0 24 24")
}
```

**Operations**:

1. **register(name, pathData, options)**:
   - Check if defs container exists, create if needed
   - Check if symbol already exists (skip if no overwrite flag)
   - Create `<symbol id="{name}">` with pathData
   - Store in registry Map
   - Dispatch 'nova-icons-registered' event

2. **registerBatch(definitions)**:
   - Batch create symbols
   - Single DOM operation via DocumentFragment
   - More efficient than N register() calls

3. **get(name)** (unchanged):
   - Lookup in registry Map
   - Returns IconDefinition or undefined

4. **getDefsContainer()** (enhanced):
   - If defsContainer exists in DOM, return it
   - If defsContainer removed, recreate and return (NEW)
   - If never created, create and return

---

## Validation Rules

### Component Validation

**Attribute Constraints**:
- `icon`: Any string (if not registered, renders placeholder)
- `size`: CSS length value (not validated, passed to CSS)
- `color`: CSS color value (not validated, passed to CSS)

**Render Conditions**:
- If `icon` attribute missing → render nothing
- If `icon` attribute present but not registered → render placeholder + console warning
- If `icon` registered → render `<svg>` with `<use href="#icon-name">`

**Re-render Triggers**:
- `attributeChangedCallback()` called (immediate re-render)
- `connectedCallback()` called (initial render)
- prefers-reduced-motion media query change (re-render to update CSS variable)

### Registry Validation

**Symbol ID Constraints**:
- Must be valid CSS ID (no spaces, special characters)
- Duplicates handled via overwrite flag
- Not enforced by registry (assumed valid from caller)

**Path Data Constraints**:
- Must be valid SVG path/element strings
- Not validated by registry (browser handles invalid SVG gracefully)

---

## Relationships

```
NovaIcon Component
  ├─ Reads from → NovaIconRegistry.get(name)
  └─ Renders → <svg><use href="#name"></use></svg>
                    │
                    └─ References → Shared Defs Container
                                      └─ Contains → <symbol id="name">

NovaIconRegistry
  ├─ Manages → Shared Defs Container
  └─ Stores → Map<name, IconDefinition>
```

**Event Flow**:
```
1. User sets attribute: <nova-icon icon="star">
2. attributeChangedCallback() triggered
3. Component calls NovaIconRegistry.get("star")
4. If found: Render <svg><use href="#star"></use>
5. If not found: Render placeholder + console.warn()
```

**Symbol Sharing**:
```
NovaIconRegistry.register("star", pathData)
  → Creates <symbol id="star"> in defs
  
<nova-icon icon="star"> → Renders <use href="#star">
<nova-icon icon="star"> → Renders <use href="#star">
<nova-icon icon="star"> → Renders <use href="#star">

Result: 1 symbol definition, 3 <use> references
```

---

## Edge Case Handling

### Missing Icon

**Scenario**: Component references icon not yet registered

**Data Flow**:
```
1. icon="foo" attribute set
2. NovaIconRegistry.get("foo") returns undefined
3. Component renders placeholder SVG
4. Component logs: console.warn('[NovaIcon] Icon "foo" not found...')
```

**State**: Component displays placeholder until icon registered and attribute changes or re-render triggered.

### Defs Container Removed

**Scenario**: Another script removes shared defs container from DOM

**Data Flow**:
```
1. NovaIconRegistry.defsContainer reference becomes stale (element not in DOM)
2. Component calls NovaIconRegistry.get(name)
3. Registry method calls getDefsContainer()
4. getDefsContainer() detects container not in DOM
5. getDefsContainer() recreates container
6. All registered symbols re-added to new container
```

**Recovery**: Automatic, no user intervention needed.

### innerHTML Cleared Externally

**Scenario**: Another script clears component's innerHTML

**Data Flow**:
```
1. External code: icon.innerHTML = ''
2. Component's <svg> removed
3. User changes attribute OR component reconnects to DOM
4. attributeChangedCallback() or connectedCallback() triggers
5. render() re-creates SVG content
```

**Recovery**: Automatic on next lifecycle event.

### Attribute Changes

**Scenario**: User changes icon name, size, or color attribute

**Data Flow**:
```
1. Attribute changed: icon.setAttribute('icon', 'newIcon')
2. attributeChangedCallback(name='icon', old='oldIcon', new='newIcon')
3. oldValue !== newValue check passes
4. render() called immediately
5. innerHTML cleared
6. New SVG created with <use href="#newIcon">
7. New SVG appended to component
```

**Performance**: ~1ms per re-render (negligible).

---

## Summary

**Key Changes from Shadow DOM**:
- No `_shadowRoot` field
- No `<style>` element in component
- SVG rendered as direct child in light DOM
- `<use>` elements reference shared symbols
- CSS variables set on host element, inherited naturally

**Data Maintained**:
- Same component attributes
- Same registry API and data structures
- Same IconDefinition type
- Same lifecycle methods

**New Behaviors**:
- Placeholder rendering for missing icons
- Automatic defs container recreation
- Natural CSS cascade instead of shadow DOM piercing
