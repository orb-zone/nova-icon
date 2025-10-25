# API Contract: NovaIcon Component (Light DOM)

**Feature**: 002-light-dom-refactor  
**Date**: 2025-10-24  
**Status**: Specification  
**Breaking Changes**: None (maintains API compatibility with 001-package-setup)

---

## NovaIcon Web Component

### Custom Element Registration

```typescript
customElements.define('nova-icon', NovaIcon);
```

**Element Name**: `nova-icon`  
**Extends**: `HTMLElement`

---

## Public API

### Attributes

All attributes are optional. Component observes these attributes for changes via `observedAttributes`.

#### `icon`

**Type**: `string`  
**Required**: No  
**Default**: `undefined`  
**Description**: Name of the icon to render. Must match a registered icon name in NovaIconRegistry.

**Behavior**:
- If not set or empty: Component renders nothing
- If set but not registered: Component renders placeholder icon + console warning
- If set and registered: Component renders SVG with `<use href="#icon-name">`

**Example**:
```html
<nova-icon icon="star"></nova-icon>
<nova-icon icon="sun"></nova-icon>
```

---

#### `size`

**Type**: `string` (CSS length value)  
**Required**: No  
**Default**: `"24px"`  
**Description**: Size of the icon (width and height).

**Behavior**:
- Sets CSS custom property `--icon-size` on host element
- Can be any valid CSS length: `px`, `rem`, `em`, `%`, etc.
- Applied to host element sizing (via Tailwind or custom CSS)

**Example**:
```html
<nova-icon icon="star" size="32px"></nova-icon>
<nova-icon icon="star" size="2rem"></nova-icon>
```

---

#### `color`

**Type**: `string` (CSS color value)  
**Required**: No  
**Default**: `"currentColor"`  
**Description**: Color of the icon stroke/fill.

**Behavior**:
- Passed to SVG `color` style
- Can be any valid CSS color: hex, rgb, hsl, named color, etc.
- Uses `currentColor` by default to inherit from parent text color

**Example**:
```html
<nova-icon icon="star" color="red"></nova-icon>
<nova-icon icon="star" color="#ff0000"></nova-icon>
<nova-icon icon="star" color="rgb(255,0,0)"></nova-icon>
```

---

### Properties

#### `reducedMotion`

**Type**: `boolean` (readonly)  
**Description**: Indicates whether the user has `prefers-reduced-motion: reduce` enabled.

**Behavior**:
- Updated automatically when media query changes
- Triggers re-render to update `--animation-enabled` CSS variable
- `true` if reduced motion preferred, `false` otherwise

**Example**:
```typescript
const icon = document.querySelector('nova-icon');
if (icon.reducedMotion) {
  console.log('Animations disabled for accessibility');
}
```

---

### Lifecycle Methods

These are standard Web Component lifecycle callbacks. Users don't call these directly.

#### `constructor()`

**Description**: Initializes component state and sets up media query listener.

**Side Effects**:
- Sets `_reducedMotion` based on current media query
- Adds media query change listener

---

#### `connectedCallback()`

**Description**: Called when component is added to the DOM.

**Side Effects**:
- Triggers initial `render()`
- SVG content created and appended to light DOM

---

#### `disconnectedCallback()`

**Description**: Called when component is removed from the DOM.

**Side Effects**:
- No cleanup needed in light DOM version (browser handles removal)
- Can be used for future cleanup if needed

---

#### `attributeChangedCallback(name, oldValue, newValue)`

**Parameters**:
- `name: string` - Attribute name (`icon`, `size`, or `color`)
- `oldValue: string | null` - Previous attribute value
- `newValue: string | null` - New attribute value

**Description**: Called when an observed attribute changes.

**Side Effects**:
- If `oldValue !== newValue`: Triggers `render()`
- Component re-renders with new attribute values

**Example** (internal, user doesn't call this):
```typescript
icon.setAttribute('icon', 'sun'); // Triggers attributeChangedCallback
```

---

## DOM Structure (Light DOM)

### Standard Icon Rendering

**HTML Output**:
```html
<nova-icon icon="star" size="24px" color="currentColor">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="color: currentColor;">
    <use href="#star"></use>
  </svg>
</nova-icon>
```

**CSS Variables Set**:
```css
nova-icon {
  --icon-size: 24px;
  --animation-enabled: 1; /* or 0 if prefers-reduced-motion */
}
```

---

### Placeholder Icon Rendering

**When**: Icon name not registered in NovaIconRegistry

**HTML Output**:
```html
<nova-icon icon="missing">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="12" y="16" text-anchor="middle" fill="currentColor" font-size="14">?</text>
  </svg>
</nova-icon>
```

**Console Warning**:
```
[NovaIcon] Icon "missing" not found. Register it via NovaIconRegistry.register()
```

---

### Empty Rendering

**When**: No `icon` attribute set

**HTML Output**:
```html
<nova-icon>
  <!-- Empty, no children -->
</nova-icon>
```

---

## Styling

### Tailwind CSS Integration

**Direct Application**:
```html
<nova-icon icon="star" class="w-12 h-12 text-blue-500"></nova-icon>
```

**Result**: Tailwind classes apply directly to host element and SVG content via light DOM cascade.

---

### CSS Custom Properties

**Available Variables**:
- `--icon-size`: Component size (set by component, can be overridden)
- `--animation-enabled`: `1` or `0` (set by component based on prefers-reduced-motion)

**User-Defined Variables** (inherit naturally):
```html
<div style="--line-color: gold; --line-weight: 3;">
  <nova-icon icon="star"></nova-icon>
</div>
```

SVG paths inside symbols can reference these variables via `stroke="var(--line-color)"`.

---

## Events

### Dispatched Events

None. Component does not dispatch custom events (uses standard attribute change detection).

---

### Listened Events

#### `nova-icons-registered`

**Source**: Dispatched by NovaIconRegistry when icons are registered

**Behavior**:
- If component references unregistered icon, it sets `data-waiting-for-registration` attribute
- Listens for `nova-icons-registered` event once
- On event, re-renders to check if icon now available

**Example** (internal behavior):
```typescript
// User registers icon after component rendered
NovaIconRegistry.register('star', '<path d="..."/>');
// Dispatches 'nova-icons-registered' event
// Component hears event and re-renders
```

---

## Error Handling

### Missing Icon

**Condition**: `icon` attribute references unregistered icon

**Behavior**:
1. Render placeholder icon (outlined square with question mark)
2. Log console warning with icon name and registration instructions
3. Listen for `nova-icons-registered` event to retry

**Not an Error**: Does not throw, does not halt execution

---

### Invalid Attributes

**Condition**: Attribute has invalid value (e.g., `size="foo"`, `color="notacolor"`)

**Behavior**:
- Values passed directly to CSS
- Browser handles invalid CSS gracefully (ignored or fallback)
- No validation or error thrown by component

---

### Defs Container Removed

**Condition**: Shared `<defs>` container removed from DOM by external code

**Behavior**:
- NovaIconRegistry automatically recreates container on next render
- User sees no disruption
- Icons continue to work

**Recovery**: Automatic, no user action needed

---

### innerHTML Cleared Externally

**Condition**: Another script clears component's innerHTML

**Behavior**:
- Component detects on next lifecycle event (attribute change or reconnection)
- Re-renders automatically
- User sees icon restored

**Recovery**: Automatic on next render trigger

---

## Breaking Changes from 001-package-setup

**None**. This refactor maintains full API compatibility:

- Same custom element name: `<nova-icon>`
- Same attributes: `icon`, `size`, `color`
- Same property: `reducedMotion`
- Same lifecycle methods
- Same NovaIconRegistry API

**Internal Changes** (not visible to users):
- Removed shadow DOM
- Render to light DOM instead
- Use `<use>` references instead of inlining paths

---

## Browser Compatibility

**Minimum Requirements**:
- SVG `<use>` element support (all modern browsers)
- Custom Elements v1 (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)
- CSS Custom Properties (all modern browsers)

**No Polyfills Needed** for target browsers (modern evergreen browsers).

---

## Testing Contract

**Test Expectations**:

### Unit Tests
- Component renders empty when no `icon` attribute
- Component renders placeholder when icon not registered
- Component renders SVG with `<use>` when icon registered
- Component re-renders on attribute changes
- Component respects `prefers-reduced-motion`
- Component sets CSS custom properties on host element

### Integration Tests
- Multiple instances share symbols (1 definition, N uses)
- Tailwind classes apply to component and SVG
- CSS custom properties inherit through light DOM
- Defs container auto-recreation works
- innerHTML cleared externally recovers on re-render

### Contract Tests
- API surface unchanged from 001-package-setup
- NovaIconRegistry methods have same signatures
- Component element name unchanged
- Observed attributes unchanged

---

## Migration Guide (from 001-package-setup shadow DOM)

**For Users**: No migration needed. API unchanged.

**For Tests**: Update shadow DOM queries to light DOM queries.

**Before**:
```typescript
const svg = icon.shadowRoot.querySelector('svg');
```

**After**:
```typescript
const svg = icon.querySelector('svg');
```

---

## Example Usage

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { NovaIconRegistry } from '@orb-zone/nova-icon';
    
    NovaIconRegistry.register('star', '<path d="M12 2 L15 10..."/>');
  </script>
</head>
<body>
  <nova-icon icon="star"></nova-icon>
</body>
</html>
```

---

### With Tailwind

```html
<nova-icon icon="star" class="w-16 h-16 text-yellow-500"></nova-icon>
<nova-icon icon="sun" class="w-8 h-8 text-orange-400"></nova-icon>
```

---

### With Custom CSS Variables

```html
<style>
  .custom-icon {
    --icon-size: 48px;
    --line-color: purple;
  }
</style>

<nova-icon icon="star" class="custom-icon"></nova-icon>
```

---

### Programmatic Usage

```typescript
const icon = document.createElement('nova-icon');
icon.setAttribute('icon', 'star');
icon.setAttribute('size', '32px');
icon.setAttribute('color', 'blue');
document.body.appendChild(icon);

// Check reduced motion
console.log(icon.reducedMotion); // true or false

// Change icon
icon.setAttribute('icon', 'sun'); // Re-renders automatically
```

---

## Summary

This API contract documents the NovaIcon component interface after the light DOM refactor. All public APIs remain unchanged from 001-package-setup, ensuring zero breaking changes for users while delivering Tailwind compatibility and efficient symbol sharing.
