# Quickstart: NovaIcon Light DOM

**Feature**: 002-light-dom-refactor  
**Date**: 2025-10-24  
**Purpose**: Quick start guide demonstrating light DOM usage with Tailwind CSS integration

---

## What Changed

NovaIcon now renders to **light DOM** instead of shadow DOM, enabling:
- ✅ Tailwind CSS utility classes work directly
- ✅ CSS custom properties inherit naturally
- ✅ Efficient symbol sharing via `<use>` elements
- ✅ Simpler styling without shadow DOM piercing

**API Unchanged**: Same attributes, same methods, zero breaking changes.

---

## Basic Usage

### 1. Install Package

```bash
# JSR.io installation
npx jsr add @orb-zone/nova-icon
# or with Deno
deno add @orb-zone/nova-icon
```

---

### 2. Register Icons

```typescript
import { NovaIconRegistry } from '@orb-zone/nova-icon';

// Register a single icon
NovaIconRegistry.register('star', `
  <path d="M12 2 L15 10 L23 10 L17 14 L19 22 L12 18 L5 22 L7 14 L1 10 L9 10 Z"/>
`);

// Or register multiple icons at once
NovaIconRegistry.registerBatch([
  {
    name: 'sun',
    paths: ['<circle cx="12" cy="12" r="4"/>', '<path d="M12 2 L12 6"/>'],
    viewBox: '0 0 24 24'
  },
  {
    name: 'moon',
    paths: ['<path d="M21 12.79A9 9 0 1 1 11.21 3..."/>'],
  }
]);
```

---

### 3. Use in HTML

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="path/to/nova-icon.js"></script>
</head>
<body>
  <!-- Basic usage -->
  <nova-icon icon="star"></nova-icon>
  
  <!-- With attributes -->
  <nova-icon icon="sun" size="32px" color="orange"></nova-icon>
</body>
</html>
```

---

## Tailwind CSS Integration

### Direct Class Application

Tailwind utilities now work directly on the component:

```html
<!-- Size with Tailwind -->
<nova-icon icon="star" class="w-8 h-8"></nova-icon>
<nova-icon icon="star" class="w-12 h-12"></nova-icon>
<nova-icon icon="star" class="w-16 h-16"></nova-icon>

<!-- Color with Tailwind -->
<nova-icon icon="star" class="text-red-500"></nova-icon>
<nova-icon icon="sun" class="text-yellow-400"></nova-icon>
<nova-icon icon="moon" class="text-blue-600"></nova-icon>

<!-- Combined -->
<nova-icon icon="star" class="w-10 h-10 text-purple-500"></nova-icon>
```

---

### Responsive Sizing

```html
<!-- Responsive sizes -->
<nova-icon 
  icon="star" 
  class="w-6 h-6 md:w-8 md:h-8 lg:w-12 lg:h-12"
></nova-icon>
```

---

### Hover Effects

```html
<!-- Hover color change -->
<nova-icon 
  icon="star" 
  class="w-10 h-10 text-gray-400 hover:text-yellow-500 transition-colors"
></nova-icon>

<!-- Hover scale -->
<nova-icon 
  icon="star" 
  class="w-10 h-10 transform hover:scale-110 transition-transform"
></nova-icon>
```

---

## CSS Custom Properties

### Inherit from Parent

```html
<div style="--line-color: gold; --line-weight: 3;">
  <nova-icon icon="star"></nova-icon>
  <!-- Icon inherits custom properties from parent -->
</div>
```

---

### Component-Specific Variables

```html
<style>
  .fancy-icon {
    --icon-size: 64px;
    --line-color: linear-gradient(to right, red, blue);
    --transition-duration: 2s;
  }
</style>

<nova-icon icon="star" class="fancy-icon"></nova-icon>
```

---

## Verifying Symbol Sharing

One of the benefits of light DOM is efficient symbol sharing. Here's how to verify it works:

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { NovaIconRegistry } from '@orb-zone/nova-icon';
    
    NovaIconRegistry.register('star', '<path d="M12 2..."/>');
  </script>
</head>
<body>
  <!-- Render same icon 100 times -->
  <div id="container"></div>
  
  <script>
    const container = document.getElementById('container');
    for (let i = 0; i < 100; i++) {
      const icon = document.createElement('nova-icon');
      icon.setAttribute('icon', 'star');
      icon.className = 'w-8 h-8 text-blue-500';
      container.appendChild(icon);
    }
  </script>
</body>
</html>
```

**Inspect in DevTools**:
1. Open DevTools → Elements tab
2. Look for `<svg style="display: none">` at top of `<body>`
3. Expand to see `<defs>` → `<symbol id="star">`
4. Path data appears **once** in the symbol
5. Each `<nova-icon>` contains `<use href="#star">` (100 references)

**Result**: 1 symbol definition + 100 `<use>` references = efficient memory usage

---

## Handling Missing Icons

If you reference an icon before registering it, NovaIcon shows a placeholder:

```html
<!-- Before registration -->
<nova-icon icon="missing"></nova-icon>
<!-- Renders: Outlined square with "?" -->
<!-- Console: [NovaIcon] Icon "missing" not found... -->
```

**Register Later**:
```typescript
// Icon automatically updates when registered
NovaIconRegistry.register('missing', '<path d="..."/>');
```

---

## Accessibility (Reduced Motion)

NovaIcon respects `prefers-reduced-motion`:

```html
<nova-icon icon="star"></nova-icon>
```

**Automatic Behavior**:
- If user has `prefers-reduced-motion: reduce`
- Component sets `--animation-enabled: 0`
- SVG animations disabled
- Icon shows final state immediately

**Check in Code**:
```typescript
const icon = document.querySelector('nova-icon');
console.log(icon.reducedMotion); // true or false
```

---

## Styling Tips

### Light DOM Means Direct Styling

You can now style the internal SVG with regular CSS:

```css
/* Style all nova-icon SVGs */
nova-icon svg {
  transition: transform 0.2s;
}

nova-icon:hover svg {
  transform: rotate(15deg);
}
```

**Before (shadow DOM)**: Required `::part` selectors or CSS variables only  
**After (light DOM)**: Standard CSS selectors work

---

### Combining Attributes and Classes

```html
<!-- Attribute sets default, class overrides -->
<nova-icon 
  icon="star" 
  size="24px" 
  color="gray" 
  class="w-16 h-16 text-blue-500"
></nova-icon>
<!-- Result: Tailwind classes take precedence -->
```

---

## Programmatic Usage

```typescript
// Create icon
const icon = document.createElement('nova-icon');
icon.setAttribute('icon', 'star');

// Apply Tailwind classes
icon.className = 'w-10 h-10 text-yellow-500';

// Add to DOM
document.body.appendChild(icon);

// Change icon dynamically
setTimeout(() => {
  icon.setAttribute('icon', 'sun');
  icon.className = 'w-10 h-10 text-orange-500';
}, 2000);
```

---

## Common Patterns

### Icon Button

```html
<button class="p-2 rounded hover:bg-gray-100">
  <nova-icon icon="star" class="w-5 h-5 text-gray-600"></nova-icon>
</button>
```

---

### Icon with Text

```html
<div class="flex items-center gap-2">
  <nova-icon icon="star" class="w-5 h-5 text-yellow-500"></nova-icon>
  <span>Favorite</span>
</div>
```

---

### Icon Grid

```html
<div class="grid grid-cols-4 gap-4">
  <nova-icon icon="star" class="w-12 h-12 text-blue-500"></nova-icon>
  <nova-icon icon="sun" class="w-12 h-12 text-yellow-500"></nova-icon>
  <nova-icon icon="moon" class="w-12 h-12 text-purple-500"></nova-icon>
  <nova-icon icon="heart" class="w-12 h-12 text-red-500"></nova-icon>
</div>
```

---

### Animated Icons (via Tailwind)

```html
<nova-icon 
  icon="star" 
  class="w-12 h-12 text-yellow-500 animate-spin"
></nova-icon>

<nova-icon 
  icon="star" 
  class="w-12 h-12 text-yellow-500 animate-pulse"
></nova-icon>

<nova-icon 
  icon="star" 
  class="w-12 h-12 text-yellow-500 animate-bounce"
></nova-icon>
```

---

## Migration from Shadow DOM Version

If you were using the 001-package-setup shadow DOM version:

### No Changes Needed in HTML

```html
<!-- This still works exactly the same -->
<nova-icon icon="star" size="24px" color="red"></nova-icon>
```

### No Changes Needed in JS

```typescript
// This still works exactly the same
NovaIconRegistry.register('star', pathData);
const icon = document.querySelector('nova-icon');
icon.setAttribute('icon', 'star');
```

### Only Benefit: Tailwind Now Works

```html
<!-- Before: Classes ignored (shadow DOM barrier) -->
<nova-icon icon="star" class="w-10 h-10 text-blue-500"></nova-icon>

<!-- After: Classes work! (light DOM) -->
<nova-icon icon="star" class="w-10 h-10 text-blue-500"></nova-icon>
```

---

## Testing Your Icons

### In Browser DevTools

1. **Inspect shared defs**:
   ```
   Elements → <body> → <svg style="display:none"> → <defs>
   ```
   See all registered symbols

2. **Inspect component**:
   ```
   Elements → <nova-icon> → <svg> → <use href="#name">
   ```
   See light DOM structure (no #shadow-root)

3. **Check CSS variables**:
   ```
   Elements → <nova-icon> → Computed styles
   ```
   See --icon-size, --animation-enabled, and inherited properties

---

### In Tests

```typescript
import { expect, test } from 'bun:test';

test('icon renders in light DOM', () => {
  const icon = document.createElement('nova-icon');
  icon.setAttribute('icon', 'star');
  document.body.appendChild(icon);
  
  // Query light DOM directly (no shadowRoot)
  const svg = icon.querySelector('svg');
  expect(svg).toBeTruthy();
  
  const use = icon.querySelector('use');
  expect(use?.getAttribute('href')).toBe('#star');
});
```

---

## Next Steps

1. **Register your icons**: Use `NovaIconRegistry.register()` or `registerBatch()`
2. **Add to HTML**: Use `<nova-icon icon="name">` elements
3. **Style with Tailwind**: Apply utility classes directly
4. **Verify sharing**: Check DevTools to see efficient symbol sharing
5. **Test accessibility**: Ensure `prefers-reduced-motion` works

**Full API docs**: See [component-api.md](./contracts/component-api.md)

---

## Troubleshooting

### Icon shows placeholder "?"

**Cause**: Icon not registered before component renders

**Fix**:
```typescript
// Register icon first
NovaIconRegistry.register('myicon', pathData);

// Then use in HTML
<nova-icon icon="myicon"></nova-icon>
```

---

### Tailwind classes not applying

**Cause**: Using shadow DOM version (from 001)

**Fix**: Upgrade to 002-light-dom-refactor version

---

### Multiple icons not sharing symbols

**Cause**: Using `register()` with same name multiple times without `overwrite: true`

**Fix**: Registry automatically deduplicates. Check DevTools to verify 1 symbol exists.

---

## Summary

Light DOM refactor enables:
- ✅ **Tailwind CSS** classes work directly
- ✅ **CSS custom properties** inherit naturally  
- ✅ **Efficient symbols** shared via `<use>`
- ✅ **Simpler styling** with standard CSS selectors
- ✅ **Zero breaking changes** to API

Start using NovaIcon with light DOM today!
