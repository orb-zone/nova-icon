# Data Model: Lineart Animations

## Entities

### NovaIcon Component
- **Description**: Web component that renders animated SVG icons.
- **Attributes**:
  - `animation`: String (e.g., "hover") - Enables stroke-dash animations.
  - `duration`: String (default: "2.2s") - Animation length.
  - `delay`: String (default: "0s") - Animation start delay.
  - `stagger`: String (default: "0s") - Sequential path delays.
  - `layers`: String (e.g., "bg:2s,pg:1s:0.5s,fg:0.5s:1s") - Multi-layer animations.
  - `icon`: String - SVG icon identifier.
- **Relationships**: Contains Animation Layers.

### Animation Layer
- **Description**: Group of paths with shared timing properties.
- **Attributes**:
  - `name`: String (e.g., "bg", "pg", "fg")
  - `duration`: String
  - `delay`: String
- **Relationships**: Contains Path Elements.

### Path Element
- **Description**: Individual SVG path with animation properties.
- **Attributes**:
  - `pathLength`: Number (set to 1 for normalization)
  - `stroke-dasharray`: String (e.g., "1 0")
  - `stroke-dashoffset`: Number (animated from 1 to 0)
  - `transition`: String (inline CSS for timing)
- **Relationships**: Belongs to Animation Layer.

### Timing Configuration
- **Description**: CSS custom properties defining animation behavior.
- **Attributes**:
  - `--dash-offset`: Number (1 to 0)
  - `--path-index`: Number (for stagger calculations)
- **Relationships**: Applied to Path Elements.

## Validation Rules
- Animation attributes must be valid CSS time values (e.g., "1s", "0.5s").
- Layers attribute must follow comma-separated format: "layer:duration:delay".
- Path elements must have pathLength="1" when animations enabled.
- Respect prefers-reduced-motion: disable animations if set.

## State Transitions
- **Initial**: Icon rendered without animation.
- **Hover Start**: Trigger animation by setting --dash-offset to 0.
- **Animation Complete**: All paths fully drawn.
- **Accessibility Override**: If prefers-reduced-motion, show final state immediately.