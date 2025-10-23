# SVG Symbol Icon Animation - Corrected Implementation Plan

**2025 Best Practices & Technical Deep Dive**

---

## Executive Summary

This document outlines the complete guide for building an animated SVG icon system with layered stroke-dash animations. It includes critical findings from debugging why SVG animations fail when using CSS custom properties, shadow DOM complications with `<use>` elements, and the definitive 2025 approach for reliable cross-browser animations. The system is designed to be standalone but compatible with design systems like Nova Web Components, leveraging CSS custom properties for theming and Tailwind CSS integration.

**Corrected Critical Discovery:** CSS custom properties inherit through the shadow DOM boundary and work reliably for animations. The solution uses CSS variable inheritance through `<use>` elements combined with transitions defined inline on path elements. Direct CSS property targeting of paths inside `<use>` elements is NOT reliable across browsers. For design system integration, expose variables that align with external theming (e.g., Nova's Spark/Ocean themes) to enable seamless styling without dependencies.

---

## Part 1: Critical Issues & Root Causes

### Issue 1: Trying to Animate Variables Directly (Anti-Pattern)

**The Problem:**

```css
/* ❌ This DOESN'T work - animating a variable itself */
svg.icon:hover use {
  --dash-offset: 0;  /* Variable changes instantly, no smooth transition */
  transition: --dash-offset 2s ease-out;  /* Can't transition variables! */
}
```

**Why it fails:**

1. CSS custom properties are not animatable types in the CSS spec (`Animatable: no`)
2. The browser cannot interpolate between variable values because variables are stored as strings
3. When the variable changes, any attribute/property using it updates instantly
4. `transition` properties cannot animate variables themselves

**What happens:**

- The variable `--dash-offset` changes from `1` to `0`
- The `stroke-dashoffset="var(--dash-offset)"` attribute updates instantly
- The `transition` on the path can't interpolate a property that changed instantaneously
- Result: No animation, just a sudden jump

**The Fix:**

- Don't try to transition the variable itself
- Instead, let the variable change instantly
- The transition happens on the actual CSS property (stroke-dashoffset), not the variable
- Define the transition on the path that uses the variable

---

### Issue 2: Trying to Target Paths Inside `<use>` Elements with Direct CSS (Anti-Pattern)

**The Problem:**

```css
/* ❌ This DOESN'T work reliably - trying to pierce shadow DOM */
svg.icon:hover path {
  stroke-dashoffset: 0;  /* Unreliable - paths are in shadow DOM */
}
```

**Why it's unreliable:**

- The `<path>` elements are inside `<symbol>`, which is copied into a shadow DOM by `<use>`
- CSS selectors from outside the shadow DOM cannot reliably reach and style elements inside
- Different browsers handle this inconsistently
- Even if the selector "works," the transition may not fire properly across the shadow boundary

**Best Practice:** Don't try to target paths directly with external CSS. Instead:

1. Use CSS custom properties (variables) on the `<use>` elements
2. These variables inherit through the shadow DOM boundary (this is intentional in the CSS spec)
3. Let paths inside the symbol reference these inherited variables
4. Define transitions inline on the path elements via `style` attributes
5. When the variable changes on `<use>`, the path's property changes, triggering the inline transition

---

### Issue 3: Correct Pattern - CSS Variables + Inline Transitions

**The Working Approach:**

```css
/* ✓ This DOES work - target the <use> element, change inherited variable */
svg.icon:hover use {
  --dash-offset: 0;  /* Variable changes on <use> */
}
```

```html
<!-- ✓ Path references the inherited variable and transitions smoothly -->
<path pathLength="1"
      stroke-dashoffset="var(--dash-offset)"
      style="transition: stroke-dashoffset 2.2s ease-out;" />
```

**Why this works:**

1. CSS custom properties inherit through shadow DOM boundaries (by design)
2. When `--dash-offset` changes on `<use>`, all children inherit the new value
3. The path's `stroke-dashoffset="var(--dash-offset)"` property updates
4. The inline `transition: stroke-dashoffset ...` smoothly interpolates the change
5. The transition animates the actual CSS property, not the variable
6. Result: Smooth animation that works reliably across all modern browsers

**Critical distinction:**

- Variable change: Instant (variables can't be transitioned)
- Property change: Smooth (the stroke-dashoffset property updates and transitions smoothly)

---

## Part 2: 2025 Best Practices for SVG Stroke-Dash Animations

### Best Practice #1: Use `pathLength="1"` for Normalized Animations

**Why normalize:**

- SVG paths have variable lengths (50px, 1000px, etc.)
- Without normalization, calculating dash arrays is complex
- With `pathLength="1"`, all paths are conceptually "1 unit long" regardless of actual length
- Makes `stroke-dasharray="1 0"` and `stroke-dashoffset` values consistent and predictable

**Implementation:**

```html
<path pathLength="1"
      stroke-dasharray="var(--dash-array, 1 0)"
      stroke-dashoffset="var(--dash-offset, 1)"
      d="M12 2 L15 10 L23 10..." />
```

**How it works:**

- `pathLength="1"`: SVG normalizes path length to 1 unit
- `stroke-dasharray="1 0"`: Draw 1 unit, gap 0 units (continuous line, but dashable)
- `stroke-dashoffset="1"` (initial): Offset by 1 unit initially (line is hidden, off-screen)
- On hover, `stroke-dashoffset: 0`: Line becomes visible at position 0 (via inherited variable change)
- Variable inheritance + inline transition = smooth animation

---

### Best Practice #2: Define Transitions Directly on Path Elements

**Correct approach:**

```html
<path pathLength="1"
      stroke-dashoffset="var(--dash-offset, 1)"
      style="transition: stroke-dashoffset 2.2s ease-out;" />
```

**Why inline style:**

- Inline styles have highest specificity, ensuring they're not overridden
- Shadow DOM doesn't block inline styles (they're part of the element itself)
- Clearest intent: "this element should animate this property"
- Works reliably across all browsers

**Why target the property, not the variable:**

- Transitions animate CSS properties, not variables
- When you transition a property, the browser interpolates its value over time
- Custom properties hold values as strings, not interpolatable types
- The property (stroke-dashoffset) gets updated by the inherited variable, then transitions smoothly

---

### Best Practice #3: Use CSS Variables on `<use>` Elements (Not Direct Path Targeting)

**Correct approach:**

```css
/* Apply variable change to the <use> element */
svg.icon:hover use {
  --dash-offset: 0;  /* Inherited by all children in shadow DOM */
}
```

**Why this works (and direct targeting doesn't):**

- CSS custom properties inherit through shadow DOM boundaries (intentional spec design)
- Targeting `<use>` elements is reliable and cross-browser
- Targeting paths inside `<use>` with external CSS is unreliable
- Variable inheritance is the intended mechanism for styling across shadow boundaries

**Example with multiple layers:**

```css
svg.icon:hover use {
  --dash-offset: 0;  /* All three use elements' paths inherit this */
}

use.icon-bg {
  --line-weight: 10;
  --draw-duration: 2.6s;
}

use.icon-pg {
  --line-weight: 3;
  --draw-duration: 1.6s;
  --draw-delay: 1s;
}

use.icon-fg {
  --line-weight: 1;
  --draw-duration: 0.6s;
  --draw-delay: 2s;
}
```

Each `<use>` element can have its own timing variables, and all inherit the `--dash-offset` change on hover.

---

### Best Practice #4: Separate Configuration (Variables) from Animation (Properties)

**Architecture pattern:**

```css
:root {
  /* Configuration - safe to use as variables, inherited through shadow DOM */
  --draw-duration: 2.2s;
  --draw-timing: ease-out;
  --draw-delay: 0s;
  --stagger: 0.15s;
  --dash-array: 1 0;
  --dash-offset: 1;  /* Initial state */
  --line-weight: 2;
  --line-color: currentColor;
}

/* Animation - triggered by variable change on <use> */
svg.icon:hover use {
  --dash-offset: 0;  /* Triggers smooth property change via inheritance */
}

/* Transition definition - uses variables for timing config */
path {
  stroke-dashoffset: var(--dash-offset);  /* Property = variable */
  transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);  /* Transition on property */
}
```

**Why split:**

- Variables work great for configuration (timing, colors, sizes)
- Variables inherit through shadow DOM (the intended mechanism)
- Properties are what actually get transitioned smoothly
- Don't try to animate the variables themselves—let property changes driven by variable inheritance be transitioned

---

### Best Practice #5: Implement Stagger Effects with Calculated Delays

**Correct approach:**

```html
<!-- Center circle animates first -->
<circle
  pathLength="1"
  style="
    --path-index: 0;
    transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);
    transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index));
  "
/>

<!-- Ray 1 animates 0.08s after center -->
<path
  pathLength="1"
  style="
    --path-index: 1;
    transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);
    transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index));
  "
/>

<!-- Ray 2 animates 0.16s after center, etc. -->
<path
  pathLength="1"
  style="
    --path-index: 2;
    transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);
    transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index));
  "
/>
```

**How it works:**

- `--path-index`: Sequential index of this element (0, 1, 2, etc.), set per element
- `--stagger`: Time between each element's animation, set on parent `<use>` (default: 0s for no stagger)
- `--draw-delay`: Base delay for the layer, set on parent `<use>`
- `calc()`: Multiplies path index by stagger time, then adds base delay
- Result: Each element starts animating after the previous one

**Timing example with `--stagger: 0.08s` and `--draw-delay: 0.5s`:**

- Path 0: starts at 0.5s (0.5 + 0.08 * 0)
- Path 1: starts at 0.58s (0.5 + 0.08 * 1)
- Path 2: starts at 0.66s (0.5 + 0.08 * 2)
- Path 3: starts at 0.74s (0.5 + 0.08 * 3)
- Creates sequential "drawing" effect with consistent timing

---

### Best Practice #6: Layer Composition with Custom Per-Instance Timing

**Correct approach - Setting timing via `<use>` inline styles:**

```html
<!-- Background layer: thick stroke, slow animation, starts immediately -->
<use href="#icon-star" class="icon-bg"
      style="
        --line-weight: 6;
        opacity: .35;
        filter: url(#glow-2);
        --draw-duration: 2.6s;
      " />

<!-- Playground layer: medium stroke, medium animation, starts at 1s -->
<use href="#icon-star" class="icon-pg"
      style="
        --line-weight: 3;
        opacity: .5;
        --draw-duration: 1.6s;
        --draw-delay: 1s;
        --stagger: 0.1s;
      " />

<!-- Foreground layer: thin stroke, fast animation, starts at 2s -->
<use href="#icon-star" class="icon-fg"
      style="
        --line-weight: 1;
        opacity: 1;
        --draw-duration: 0.6s;
        --draw-delay: 2s;
        --stagger: 0.05s;
      " />
```

**How it works:**

- Each `<use>` element receives its own timing variables via inline styles
- All paths inside each `<use>` inherit these per-layer variables
- Paths use these variables in their transition definition
- Each layer draws at its own pace, with its own start delay and stagger time
- Creates sophisticated multi-layer animation effect with cascading timing

**Important:** The `--draw-duration`, `--draw-delay`, and `--stagger` are used in the `transition` style on paths:

```html
<path style="
  --path-index: 0;
  transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);
  transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index));
" />
```

**Timing cascade example:**

- Background layer: All paths draw from 0s to 2.6s (no stagger by default)
- Playground layer: Paths draw sequentially from 1s, each 0.1s apart, each taking 1.6s
- Foreground layer: Paths draw sequentially from 2s, each 0.05s apart, each taking 0.6s

---

### Best Practice #7: Add Transparent Fill for Better Interaction

**Implementation:**

```css
use.icon-bg {
  fill: rgba(0, 0, 0, 0.05);  /* Nearly invisible, but clickable */
}
```

**Why:**

- Expand hover target beyond just the stroke line
- Users expect larger clickable area than thin line
- 5% opacity is imperceptible but functionally complete
- Improves UX significantly

---

### Best Practice #8: Accessibility - Respect prefers-reduced-motion

**Implementation:**

```css
@media (prefers-reduced-motion: reduce) {
  svg.icon path {
    stroke-dashoffset: 0 !important;  /* Show fully, no animation */
    transition: none !important;
  }
}
```

**Why important:**

- Some users experience motion sickness from animations
- Browsers signal this preference via `prefers-reduced-motion: reduce`
- Set final state directly, no animation
- Use `!important` to ensure it overrides all other styles

---

### Best Practice #9: Filter Definitions in Hidden SVG Defs

**Correct approach:**

```html
<svg aria-hidden="true" style="position:absolute; width:0; height:0; overflow:hidden">
  <defs>
    <filter id="glow-2">...</filter>
    <symbol id="icon-star">...</symbol>
  </defs>
</svg>

<svg class="icon">
  <use href="#icon-star" />
</svg>
```

**Why:**

- Defs don't render visually, but are referenced by `href`
- Hide the container with dimensions `width:0; height:0` to reduce layout thrashing
- All reusable components (symbols, filters) in one place
- Main icon SVG stays clean and focused

---

### Best Practice #10: Use `vector-effect: non-scaling-stroke`

**Implementation:**

```html
<path style="vector-effect: non-scaling-stroke;" />
```

**Why:**

- When SVG is scaled, stroke width normally scales too
- `vector-effect: non-scaling-stroke` keeps stroke width consistent
- Stroke remains 2px whether icon is 100px or 500px
- Essential for responsive icons

---

### Best Practice #11: Theming and Design System Integration

**Implementation:**

```css
:root {
  /* Default theming variables - can be overridden by design system */
  --line-color: currentColor;  /* Inherits from parent, e.g., Tailwind's text-* classes */
  --line-weight: 2;
  --draw-duration: 2.2s;
  /* Map to design system tokens, e.g., Nova's Spark/Ocean themes */
  --primary-color: var(--nova-color-primary, #2babe2);  /* Fallback to default */
  --background-color: var(--nova-color-background, #111);
}

svg.icon {
  color: var(--primary-color);  /* Uses inherited or design system color */
}
```

**Why:**

- Use `currentColor` for strokes to inherit from the component's `color` property or parent styles
- Expose CSS custom properties that align with design system tokens (e.g., Nova's `--nova-color-*`)
- Allow Tailwind utilities (e.g., `text-blue-500`) to apply directly to the component without shadow DOM blocking
- Ensures standalone operation with fallbacks while enabling seamless integration with frameworks like Nova Web Components
- Avoid hardcoding colors; rely on inheritance for theming flexibility

**Integration Example with Nova:**

- Import Nova tokens (e.g., `spark.css`) to set global CSS variables
- Apply Tailwind classes to the icon: `<nova-icon class="w-16 h-16 text-primary">`
- The component inherits `--nova-color-primary` for consistent theming

---

## Part 3: Complete Working Example Analysis

### example.html: Working Implementation with Two Icons (✓ CORRECT)

This example demonstrates the correct pattern with real, working code:

```css
svg.icon:hover use {
  --dash-offset: 0;
}
```

```html
<path
  pathLength="1"
  stroke-dashoffset="var(--dash-offset)"
  style="
    --path-index: 0;
    transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);
    transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index));
  "
  d="..."
/>
```

**Why this works:**

1. Variable `--dash-offset` changes on `<use>` from 1 to 0
2. Paths inherit the new variable value through shadow DOM
3. The `stroke-dashoffset` property (using var()) updates instantly
4. The inline `transition` smoothly interpolates the property change
5. Stagger delays are calculated per-path with clear `--path-index` variable
6. Each `<use>` layer has independent `--draw-duration` and `--draw-delay` via inline styles
7. `--stagger` is configurable per layer to control sequential animation timing

**Results:**

- ✓ Hover animation works smoothly across all modern browsers
- ✓ Stagger effect works reliably (each path delays after the previous)
- ✓ Multiple layer timings work with different durations
- ✓ Two different icon symbols (star and sun-rays) demonstrate reusability
- ✓ Responsive sizing with `vector-effect: non-scaling-stroke`
- ✓ Accessibility respects `prefers-reduced-motion`

---

### What Does NOT Work (Examples to Avoid)

**Anti-pattern: Trying to target paths directly**

```css
/* ❌ UNRELIABLE - tries to pierce shadow DOM */
svg.icon:hover path {
  stroke-dashoffset: 0;
}
```

This fails because:

- Paths are in shadow DOM created by `<use>`
- External CSS selectors can't reliably target into shadow DOM
- Even if selector matches, the transition may not work properly across the boundary
- Inconsistent browser behavior

**Anti-pattern: Using global variables without per-layer overrides**

```css
/* ❌ RIGID - no per-layer timing control */
:root {
  --draw-duration: 2.2s;
}

/* All layers animate at same speed, no flexibility */
```

Better: Allow each `<use>` class to override:

```css
:root {
  --draw-duration: 2.2s;  /* Default */
}

use.icon-bg {
  --draw-duration: 2.6s;  /* Override for this layer */
}

use.icon-pg {
  --draw-duration: 1.6s;  /* Override for this layer */
}
```

---

## Part 4: Step-by-Step Implementation Guide

### Phase 1: HTML Structure (No Custom Properties Yet)

**Task 1.1: Create basic HTML scaffold**

- DOCTYPE, html, head, body tags
- Meta charset UTF-8
- Semantic title
- No styles yet

**Task 1.2: Create hidden defs SVG**

- SVG with `aria-hidden="true"`
- Position absolute, width/height 0, overflow hidden
- Inside: `<defs>` container

**Task 1.3: Create reusable filter**

- Filter ID: `glow-2`
- Use `feGaussianBlur` with `stdDeviation="2"`
- Use `feMerge` to combine glow with source graphic

**Task 1.4: Create symbol element**

- ID: `icon-star`
- ViewBox: `-3 -3 30 30` (gives breathing room around 24x24 star)
- Inside: `<g>` with fill and stroke attributes
- Don't set `stroke-dashoffset` on group - it goes on paths

**Task 1.5: Create two paths for star**

- Outer star path: `M12 2 L15 10 L23 10 L17 14 L19 22 L12 18 L5 22 L7 14 L1 10 L9 10 Z`
- Inner diamond: `M12 6 L14 12 L12 14 L10 12 Z`
- Both with `pathLength="1"`
- Both with `stroke-dashoffset="var(--dash-offset, 1)"` (initial hidden state via variable)

**Task 1.6: Create main icon SVG**

- Class: `icon`
- Three `<use>` elements referencing `#icon-star`
- Classes: `icon-bg`, `icon-pg`, `icon-fg` (background, playground, foreground)

---

### Phase 2: Basic CSS & Custom Properties

**Task 2.1: Define :root custom properties**

- `--cursor: pointer`
- `--line-cap: round`
- `--line-join: round`
- `--line-color: currentColor`
- `--line-weight: 2`
- `--dash-array: 1 0`
- `--dash-offset: 1` (initial state)
- `--draw-duration: 2.2s` (default animation duration)
- `--draw-delay: 0s` (default delay before animation starts)
- `--draw-timing: ease-out` (default easing function)
- Note: Do NOT set `--stagger` at root level; set it per `<use>` layer as needed

**Task 2.2: Style svg.icon**

- `inline-size: 320px`
- `block-size: 320px`
- `color: #2babe2` (theme color, used via currentColor)
- `overflow: visible` (paths may extend beyond viewBox)

**Task 2.3: Style body and .stage**

- Body: `margin: 0`, `background: #111`, sans-serif font
- .stage: `display: grid`, `place-items: center`, `min-height: 100vh`

**Task 2.4: Style layers with use.class selectors**

- `.icon-bg`: `--line-weight: 10`, `opacity: 0.35`, `filter: url(#glow-2)`
- `.icon-pg`: `--line-weight: 3`, `opacity: 0.5`, different color via CSS custom property
- `.icon-fg`: `--line-weight: 1`, `opacity: 1`, white color

**Test point:** Icon should be visible, three layers stacked, no animation yet.

---

### Phase 3: Animation Infrastructure

**Task 3.1: Set up path styles for transitions**

- Each path needs inline style attribute with:
  - `--path-index: N` (set to sequential index: 0, 1, 2, etc.)
  - `transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);`
  - `transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index));`
  - `vector-effect: non-scaling-stroke` (keeps stroke width consistent when scaling)

**Example for first two paths in a symbol:**

```html
<path pathLength="1" style="
  --path-index: 0;
  transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);
  transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index));
  vector-effect: non-scaling-stroke;
" d="..." />

<path pathLength="1" style="
  --path-index: 1;
  transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);
  transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index));
  vector-effect: non-scaling-stroke;
" d="..." />
```

**Task 3.2: Add hover rule for animation trigger**

```css
svg.icon:hover use {
  --dash-offset: 0;
}
```

**Task 3.3: Add per-layer timing via inline styles on `<use>` elements (recommended)**
Instead of CSS classes, set custom properties directly on the `<use>` element:

```html
<use href="#icon-star" class="icon-bg" style="--draw-duration: 2.6s;" />
<use href="#icon-star" class="icon-pg" style="--draw-duration: 1.6s; --draw-delay: 1s; --stagger: 0.1s;" />
<use href="#icon-star" class="icon-fg" style="--draw-duration: 0.6s; --draw-delay: 2s; --stagger: 0.05s;" />
```

This approach is more explicit and easier to configure per instance.

**Test point:** Hover over icon, paths should animate smoothly via variable inheritance.

---

### Phase 4: Polish & Accessibility

**Task 4.1: Add transparent fill to background layer**

```css
use.icon-bg {
  fill: rgba(0, 0, 0, 0.05);
}
```

**Task 4.2: Prevent pointer events on FX layers (optional optimization)**

```css
use.fx {
  pointer-events: none;
}
```

**Task 4.3: Add reduced-motion media query**

```css
@media (prefers-reduced-motion: reduce) {
  svg.icon path {
    stroke-dashoffset: 0 !important;
    transition: none !important;
  }
}
```

**Task 4.4: Test at different sizes**

- Icon should work at 100px, 320px, 500px
- Stroke widths should remain consistent (due to `vector-effect`)

**Test point:** All accessibility and responsive features working.

---

### Phase 5: Testing Checklist

**Functional Tests:**

- [ ] Icon renders on page load
- [ ] Three layers are visible (different opacities)
- [ ] Hover triggers animation
- [ ] Animation runs smoothly (no jumps or jank)
- [ ] Inner path animates after outer path (stagger works)
- [ ] Each layer has its own timing if per-layer timing is set
- [ ] Glow filter is visible on background layer

**Browser Compatibility:**

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari

**Accessibility:**

- [ ] Respects prefers-reduced-motion
- [ ] Icon is semantically meaningful (title or aria-label if needed)
- [ ] Cursor changes to pointer on hover

**Responsive:**

- [ ] Works at different viewport sizes
- [ ] Stroke width stays consistent
- [ ] No layout shifts during animation

**Edge Cases:**

- [ ] Multiple hovers don't cause issues
- [ ] Animation completes fully before hover is removed
- [ ] No animation glitches on page load
- [ ] Works with `display: none / block` toggle

---

## Part 5: Common Pitfalls to Avoid

### Pitfall 1: Trying to Transition Variables Directly

```css
/* ❌ DON'T DO THIS */
use {
  --dash-offset: 1;
  transition: --dash-offset 2s ease-out;  /* Variables don't transition! */
}

svg.icon:hover use {
  --dash-offset: 0;  /* Instant, no smooth change */
}
```

**Why it fails:** Variables are not animatable types. You can't transition a variable itself.

**Fix:** Transition the property that uses the variable, not the variable:

```css
path {
  stroke-dashoffset: var(--dash-offset);
  transition: stroke-dashoffset 2s ease-out;
}

svg.icon:hover use {
  --dash-offset: 0;  /* Variable changes, property transitions smoothly */
}
```

---

### Pitfall 2: Trying to Target Paths Inside `<use>` Directly

```css
/* ❌ DON'T DO THIS - unreliable across browsers */
svg.icon:hover path {
  stroke-dashoffset: 0;
}
```

**Why it fails:** Paths are in shadow DOM; external CSS can't reliably target them.

**Fix:** Use CSS variable inheritance instead:

```css
svg.icon:hover use {
  --dash-offset: 0;
}

/* Path inside symbol references inherited variable */
<path stroke-dashoffset="var(--dash-offset)"
      style="transition: stroke-dashoffset 2s ease-out;" />
```

---

### Pitfall 3: Forgetting pathLength="1"

```html
<!-- ❌ DON'T DO THIS -->
<path d="M12 2 L15 10..." />
```

**Why it fails:** Path length varies, hard to calculate dash values.

**Fix:** Always add `pathLength="1"` to normalize:

```html
<path pathLength="1" d="M12 2 L15 10..." />
```

---

### Pitfall 4: Applying Transitions to `<use>` Elements

```css
/* ❌ DON'T DO THIS */
svg.icon use {
  transition: stroke-dashoffset 2s ease-out;
}
```

**Why it fails:** Transition on `<use>` doesn't reach paths inside symbol via shadow DOM reliably.

**Fix:** Apply transition directly on path elements via inline `style` attribute:

```html
<path stroke-dashoffset="var(--dash-offset)"
      style="transition: stroke-dashoffset 2s ease-out;" />
```

---

### Pitfall 5: Mixing Animations and Transitions

```css
/* ❌ DON'T DO THIS */
@keyframes drawPath {
  to { stroke-dashoffset: 0; }
}

path {
  animation: drawPath 2s ease-out;
  transition: stroke-dashoffset 0.3s ease-out;
}

svg.icon:hover path {
  stroke-dashoffset: 0;
}
```

**Why it fails:** Animation and transition fight for control of the same property.

**Fix:** Use transitions OR animations, not both. For hover effects, use transitions:

```css
path {
  transition: stroke-dashoffset 2s ease-out;
}

svg.icon:hover use {
  --dash-offset: 0;
}
```

---

### Pitfall 6: Forgetting vector-effect: non-scaling-stroke

```html
<!-- ❌ Without vector-effect -->
<path d="..." />
```

**Why it fails:** Stroke width scales with icon size, looks inconsistent.

**Fix:** Always add `style="vector-effect: non-scaling-stroke"` to stroked paths:

```html
<path style="vector-effect: non-scaling-stroke;" d="..." />
```

---

### Pitfall 7: Setting stroke-dasharray Wrong

```html
<!-- ❌ WRONG -->
<path pathLength="1" stroke-dasharray="1" />
<!-- ^ This creates unexpected visual behavior -->

<!-- ✓ CORRECT -->
<path pathLength="1" stroke-dasharray="1 0" />
<!-- ^ This makes continuous line that can be offset -->
```

**Why it matters:** `1` alone creates a dash-gap pair that may not be what you expect. `1 0` is explicit: 1 unit of line, 0 units of gap (continuous).

---

### Pitfall 8: Not Using `overflow: visible` on Icon

```css
/* ❌ DON'T DO THIS */
svg.icon {
  overflow: hidden;
}
```

**Why it fails:** Paths with large stroke widths may be clipped.

**Fix:** Use `overflow: visible` or don't set it (default is `visible`):

```css
svg.icon {
  overflow: visible;
}
```

---

## Part 6: Architecture Decisions Made

### Decision 1: Variable Inheritance vs. Direct CSS Targeting

**Chosen:** CSS variable inheritance through `<use>` elements
**Reason:** Shadow DOM boundary is reliably crossed by inherited variables. Direct CSS targeting of paths is unreliable and inconsistent.

### Decision 2: Where to Trigger the Animation

**Chosen:** Change CSS variables on `<use>` elements via `svg.icon:hover use`
**Reason:** `:hover` on `<use>` is stable. Variable changes inherit to paths. Paths have inline transitions that smooth the property changes.

### Decision 3: Where to Store Variables

**Chosen:** `:root` level with per-layer overrides
**Reason:** Global scope allows all layers to inherit timing/config. Per-layer CSS classes allow independent timing for stacked layers.

### Decision 4: Layer Composition

**Chosen:** Three `<use>` elements with same symbol, different CSS variables
**Reason:** DRY principle, single symbol maintained in one place, each layer gets custom timing/styling.

### Decision 5: Transition Definition Location

**Chosen:** Inline `style` attributes on path elements
**Reason:** Inline styles have highest specificity, work reliably through shadow DOM, clearest intent.

### Decision 6: Stagger Implementation

**Chosen:** CSS custom properties + `calc()` in `transition-delay`
**Reason:** CSS-only solution, no JavaScript needed, works at any scale.

### Decision 7: Theming and Design System Compatibility

**Chosen:** CSS custom properties with inheritance and fallbacks (e.g., `currentColor`, `--nova-color-primary`)
**Reason:** Enables standalone use with defaults while allowing integration with design systems like Nova Web Components. Supports Tailwind utilities by avoiding shadow DOM for styling, ensuring variables inherit from external themes.

---

## Part 7: 2025 Browser Support

### Properties Used

- `stroke-dasharray` - Universal support
- `stroke-dashoffset` - Universal support
- `pathLength` - Universal support
- `vector-effect: non-scaling-stroke` - Universal support (all modern browsers)
- CSS custom properties - IE not supported, all modern browsers
- CSS transitions - Universal support
- CSS variable inheritance through shadow DOM - Universal support in modern browsers
- `calc()` in custom properties - Universal support (all modern browsers)
- `prefers-reduced-motion` - All modern browsers (IE not supported)

**Conclusion:** Works reliably in all modern browsers. Legacy IE support would require fallback approach.

---

## Quick Reference: The Working Pattern

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    svg.icon {
      --cursor: pointer;
      --line-cap: round;
      --line-join: round;
      --line-color: currentColor;
      --line-weight: 2;
      --draw-duration: 2.2s;
      --draw-delay: 0s;
      --draw-timing: ease-out;
      --dash-array: 1 0;
      --dash-offset: 1;
      inline-size: 240px;
      block-size: 240px;
      color: gold;
    }

    /* ✓ Change variable on <use>, not targeting paths directly */
    svg.icon:hover use {
      --dash-offset: 0;
    }

    use.fx { pointer-events: none; }

    @media (prefers-reduced-motion: reduce) {
      svg.icon use { --dash-offset: 0 !important; }
      svg.icon path { transition: none !important; }
    }
  </style>
</head>
<body>
  <svg aria-hidden="true" style="position:absolute; width:0; height:0; overflow:hidden">
    <defs>
      <symbol id="icon-star" viewBox="-3 -3 30 30">
        <g fill="var(--fill, none)"
           stroke="var(--stroke, var(--line-color, currentColor))"
           stroke-width="var(--line-weight)"
           stroke-linecap="var(--line-cap)"
           stroke-linejoin="var(--line-join)"
           stroke-dasharray="var(--dash-array)"
           stroke-dashoffset="var(--dash-offset)">
          <path pathLength="1"
                style="
                  --path-index: 0;
                  transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);
                  transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index));
                  vector-effect: non-scaling-stroke;
                "
                d="M12 2 L15 10 L23 10 L17 14 L19 22 L12 18 L5 22 L7 14 L1 10 L9 10 Z" />
          <path pathLength="1"
                style="
                  --path-index: 1;
                  transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);
                  transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index));
                  vector-effect: non-scaling-stroke;
                "
                d="M12 6 L14 12 L12 14 L10 12 Z" />
        </g>
      </symbol>
    </defs>
  </svg>

  <svg class="icon" viewBox="0 0 24 24">
    <use href="#icon-star" class="fx icon-bg" style="--line-weight: 6; opacity: .35; --draw-duration: 2.6s;" />
    <use href="#icon-star" class="icon-pg" style="--line-weight: 3; opacity: .5; --draw-duration: 1.6s; --draw-delay: 1s; --stagger: 0.1s;" />
    <use href="#icon-star" class="fx icon-fg" style="--line-weight: 1; opacity: 1; --draw-duration: 0.6s; --draw-delay: 2s; --stagger: 0.05s;" />
  </svg>
</body>
</html>
```

**Key points:**

1. `pathLength="1"` - Normalize path to 1 unit length
2. `stroke-dashoffset="var(--dash-offset)"` - Use inherited variable as attribute
3. `--path-index: N` - Set per-element index for stagger calculation
4. `transition` on path - Smoothly animates the property change
5. `transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index))` - Stagger timing per path
6. `svg.icon:hover use { --dash-offset: 0; }` - Trigger animation via variable change on `<use>`
7. Per-`<use>` style attributes - Configure `--draw-duration`, `--draw-delay`, and `--stagger` independently per layer
8. Variable inheritance (reliable) + property transition (smooth) = working animation

---

## Implementation Checklist for Vue3 Component Migration

**Reference Implementation:** [example.html](./example.html) - Contains working examples of both star and sun-rays icons with correct variable naming and patterns.

- [ ] Extract symbol definitions into Vue template (or maintain in separate SVG defs string)
- [ ] Create component props for:
  - `iconId` - which symbol to use (default: "icon-star")
  - `size` - icon size in pixels (default: "240px")
  - `color` - theme color via CSS custom property (default: "gold")
  - `layers` - array of layer config objects with:
    - `class` - layer class name ("icon-bg", "icon-pg", "icon-fg")
    - `weight` - stroke width (defaults per layer)
    - `opacity` - layer opacity (defaults per layer)
    - `duration` - `--draw-duration`
    - `delay` - `--draw-delay`
    - `stagger` - `--stagger`
- [ ] Use `<style scoped>` for component styling
- [ ] Maintain CSS variable architecture:
  - Root level defaults: `--draw-duration`, `--draw-delay`, `--draw-timing`, `--dash-array`, `--dash-offset`
  - Per-`<use>` inline styles for layer-specific overrides
  - Hover rule: `svg.icon:hover use { --dash-offset: 0; }`
- [ ] Keep path inline styles with:
  - `--path-index: N` per element
  - `transition: stroke-dashoffset var(--draw-duration) var(--draw-timing);`
  - `transition-delay: calc(var(--draw-delay) + var(--stagger, 0s) * var(--path-index));`
  - `vector-effect: non-scaling-stroke`
- [ ] Test animations work with different prop combinations
- [ ] Test multiple icons on same page
- [ ] Ensure `prefers-reduced-motion` is respected
- [ ] Document all props and customization options

---

## References & Further Reading

- **CSS Custom Properties (CSS Variables):** Inherit through shadow DOM, drive property changes that can be transitioned
- **SVG pathLength:** Normalized path length for animations (W3C spec)
- **stroke-dasharray & stroke-dashoffset:** Standard SVG stroke dashing
- **CSS Transitions:** Property-based animation, responds to CSS property changes (not variable changes)
- **Shadow DOM:** CSS variables inherit through boundaries by design; direct selectors don't pierce reliably
- **vector-effect:** Preserves stroke width during scaling (SVG spec)
- **prefers-reduced-motion:** WCAG accessibility for motion sensitivity
- **calc() in CSS:** Dynamic value computation for timing calculations
- **Nova Web Components:** https://nova.eliagroup.io/latest/getting-started/developers/frameworks/web-components-iAGHLFf7 – For theming integration using CSS variables and Tailwind CSS
- **Tailwind CSS:** Utility-first framework for consistent styling and design system compatibility

## Updates from example.html Proof of Concept

This section documents improvements made during the example.html implementation that refined the original plan:

### Variable Naming Improvements

- **Kept semantic names:** `--draw-duration`, `--draw-delay`, `--draw-timing`, `--stagger`
- **Enhanced clarity:** Changed `--i` → `--path-index` for explicit intent in stagger calculations
- **Reason:** Shorter, high-level names (`--draw-*`) describe animation intent better than low-level `--transition-*` names. Path index is more descriptive than just `--i`.

### Removed Non-Functional Patterns

- **Removed:** Setting `--stagger` at root level
- **Why:** The original plan suggested `--stagger: 0.15s` at `:root`, but this default was never actually used because different layers need different stagger amounts
- **Better approach:** Set `--stagger` per `<use>` layer via inline styles (0.1s for middle layer, 0.05s for foreground, etc.)

### Configuration vs. Timing Split

- **CSS Property Defaults:** Set in `svg.icon` rule (applies to all icons)
- **Layer-Specific Timing:** Set via inline styles on each `<use>` element
- **Per-Path Animation:** Set via inline styles on each path with `--path-index`
- **Result:** Maximum flexibility—each icon instance can have completely different timing cascade

### Two Icon Examples

- **Added:** `#icon-sun-rays` symbol with 8 rays + center circle
- **Purpose:** Demonstrates that the pattern works with different path counts and structures
- **Layout:** Two-column grid showing both icons side-by-side, each with independent animation timing

### Transition Definition Location

- **Confirmed:** Inline `style` attributes on path elements are the most reliable
- **Why:** Work cleanly through shadow DOM, have highest specificity, clearly show animation intent
- **Not used:** CSS classes or external `<style>` blocks for transitions (less reliable through shadow DOM)