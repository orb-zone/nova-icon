# Data Model

## Entities

### IconDefinition
Represents a registered icon with its SVG paths and configuration.

**Fields**:
- `name`: string (required, unique) - Kebab-case identifier (e.g., "arrow-right")
- `paths`: string[] (required) - Array of SVG path data strings (one per layer)
- `viewBox`: string (optional, default: "0 0 24 24") - SVG viewBox attribute
- `layers`: LayerConfig[] (optional) - Configuration for each animated layer

**Validation Rules**:
- `name` must match pattern `^[a-z][a-z0-9-]*$` (kebab-case, lowercase, alphanumeric + hyphen)
- `name` must be unique across all registered icons
- `paths` must be non-empty array
- `paths` items must be valid SVG path data strings
- `viewBox` must be valid SVG viewBox format

**Relationships**:
- Has-many `LayerConfig` (one per layer)
- Stored in static registry `Map<string, IconDefinition>`

---

### LayerConfig
Configuration for individual animated layers within an icon.

**Fields**:
- `weight`: number (optional, default: 1, minimum: 0.1) - Stroke weight multiplier
- `opacity`: number (optional, default: 1, range: 0-1) - Layer opacity
- `duration`: number (optional, default: 300, minimum: 0) - Animation duration in milliseconds
- `delay`: number (optional, default: 0, minimum: 0) - Animation start delay in milliseconds
- `stagger`: number (optional, default: 50, minimum: 0) - Stagger delay between paths in milliseconds

**Validation Rules**:
- All numeric fields must be non-negative
- `opacity` must be between 0 and 1 (inclusive)
- `weight` must be at least 0.1

**Relationships**:
- Belongs-to `IconDefinition`

---

### ComponentState
Internal state of a `<nova-icon>` component instance.

**Fields**:
- `icon`: string | null - Currently displayed icon name (from `icon` attribute)
- `size`: string (default: "24px") - Icon size (from `size` attribute)
- `color`: string (default: "currentColor") - Icon color (from `color` attribute)
- `isAnimating`: boolean - Whether animation is currently active
- `reducedMotion`: boolean - User prefers-reduced-motion preference

**State Transitions**:
```
Initial → Idle: Component connected to DOM
Idle → Loading: Icon attribute set/changed
Loading → Ready: SVG symbol found and rendered
Ready → Animating: Hover/trigger event
Animating → Ready: Animation complete
Ready → Loading: Icon changed
Ready → Disconnected: Component removed from DOM
```

**Lifecycle Hooks**:
- `connectedCallback()`: Initial → Idle, render icon
- `attributeChangedCallback(name, oldValue, newValue)`: Trigger state transitions for watched attributes
- `disconnectedCallback()`: Any → Disconnected, cleanup

---

### RegistryState (Static/Shared)
Global registry state shared across all component instances.

**Fields**:
- `definitions`: Map<string, IconDefinition> - Registered icon definitions
- `defsContainer`: SVGDefsElement | null - Singleton `<svg><defs>` element in document.body
- `usageCounts`: Map<string, number> (optional) - Track icon usage for cleanup

**Methods**:
- `register(name, pathData, options)`: Add icon to registry
- `registerBatch(definitions[])`: Batch register multiple icons
- `get(name)`: Retrieve icon definition
- `has(name)`: Check if icon exists
- `getDefsContainer()`: Get or create singleton defs container

---

## Configuration File Model

### IconConfig
User-facing configuration file structure for icon definitions.

**Fields**:
- `icons`: Record<string, IconEntry> - Dictionary of icon definitions keyed by name

**Example**:
```json
{
  "icons": {
    "arrow-right": {
      "paths": ["M5 12h14", "M12 5l7 7-7 7"],
      "viewBox": "0 0 24 24",
      "layers": [
        { "weight": 1, "duration": 300 },
        { "weight": 2, "duration": 400, "stagger": 100 }
      ]
    }
  }
}
```

---

### IconEntry
Single icon entry in configuration file.

**Fields**:
- `paths`: string[] (required) - SVG path data
- `viewBox`: string (optional) - ViewBox attribute
- `layers`: LayerConfig[] (optional) - Layer configurations

---

## Validation Rules Summary

**Icon Names**:
- Must be unique
- Kebab-case only: `^[a-z][a-z0-9-]*$`
- Examples: `arrow-right`, `check-circle`, `user`

**SVG Paths**:
- Must be valid SVG path data
- Normalized with `pathLength="1"` at runtime for consistent animations

**Layer Configurations**:
- All durations/delays in milliseconds
- Opacity 0-1 range
- Weight minimum 0.1
- All numeric values non-negative

**Component Attributes**:
- `icon`: String, must reference registered icon
- `size`: String with units (e.g., "24px", "2rem") or unitless number
- `color`: Valid CSS color value
- `layers`: JSON string representing LayerConfig[] (optional override)

---

## Performance Considerations

**Registry Size**:
- Static Map storage: O(1) lookup
- Memory per icon: ~1-5KB (paths + metadata)
- Target: 200-500 icons initial, scalable to 1000+

**DOM Impact**:
- Single shared `<svg><defs>` container in document.body
- Symbols created once, referenced via `<use>` in each component
- No duplication of path data in DOM

**Animation Performance**:
- Hardware-accelerated properties only (`stroke-dashoffset`, `opacity`, `transform`)
- CSS transitions on GPU-composited layers
- Target: 60 FPS, <1% dropped frames
