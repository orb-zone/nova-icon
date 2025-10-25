# Feature Specification: Lineart Animations

**Feature Branch**: `003-lineart-animations`
**Created**: 2025-10-25
**Status**: Draft
**Input**: User description: "Focus on animations. Get back to original vision for this web-component.  An easy way to declare custom-properties to create fine-tuned timing lineart animations from paths.  Look at @concept-example.html for inspiration."

## Clarifications

### Session 2025-10-25

- Q: What specific performance targets should be set for animations? → A: Maintain 60 FPS during animation
- Q: What should be the syntax for the layers attribute? → A: Comma-separated like "bg:2s,pg:1s:0.5s,fg:0.5s:1s"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Hover Animation (Priority: P1)

Developers can easily enable stroke-dash animations on NovaIcon components by setting a simple animation prop, with icons drawing themselves on hover using default timing.

**Why this priority**: This delivers the core animation capability from the original vision, allowing immediate value without complex configuration. It's the foundation for all other animation features.

**Independent Test**: Can be fully tested by setting `animation="hover"` on a NovaIcon and verifying the icon draws itself smoothly on hover, delivering immediate visual feedback.

**Acceptance Scenarios**:

1. **Given** a NovaIcon component with `animation="hover"`, **When** the user hovers over the icon, **Then** the SVG paths animate by drawing themselves from start to finish
2. **Given** a NovaIcon with `animation="hover"` and `duration="1s"`, **When** hovering, **Then** the animation completes in 1 second
3. **Given** a NovaIcon with `animation="hover"`, **When** the user has `prefers-reduced-motion: reduce`, **Then** the animation is disabled and the icon shows in final state

---

### User Story 2 - Custom Timing and Stagger Effects (Priority: P2)

Developers can fine-tune animation timing by declaring custom properties like duration, delay, and stagger, creating sophisticated sequential drawing effects.

**Why this priority**: This enables the "fine-tuned timing" aspect of the original vision, allowing developers to create professional-quality animations without manual CSS.

**Independent Test**: Can be tested by setting `animation="hover"` with `stagger="0.1s"` and verifying paths animate sequentially with 0.1s delays between each path.

**Acceptance Scenarios**:

1. **Given** a NovaIcon with `animation="hover"` and `stagger="0.1s"`, **When** hovering, **Then** each path in the icon animates 0.1s after the previous one
2. **Given** a NovaIcon with `animation="hover"`, `delay="0.5s"`, and `duration="2s"`, **When** hovering, **Then** animation starts after 0.5s and takes 2s to complete
3. **Given** a NovaIcon with `animation="hover"` and multiple paths, **When** hovering, **Then** all paths animate in sequence using the stagger timing

---

### User Story 3 - Multi-Layer Animation Composition (Priority: P3)

Developers can create complex layered animations by configuring multiple animation layers with independent timing, similar to the background, playground, and foreground layers in concept-example.html.

**Why this priority**: This delivers the full "layered SVG stroke-dash animation system" from the original vision, enabling rich visual effects for advanced use cases.

**Independent Test**: Can be tested by setting `animation="hover"` with `layers="bg:2s,pg:1s:0.5s,fg:0.5s:1s"` and verifying each layer animates with its own timing.

**Acceptance Scenarios**:

1. **Given** a NovaIcon with `animation="hover"` and `layers="bg:2s,pg:1s:0.5s,fg:0.5s:1s"`, **When** hovering, **Then** background layer animates for 2s, playground for 1s starting at 0.5s, foreground for 0.5s starting at 1s
2. **Given** a NovaIcon with `animation="hover"` and multiple layers, **When** hovering, **Then** each layer uses different stroke weights and opacities for visual depth
3. **Given** a NovaIcon with `animation="hover"` and layers, **When** the animation completes, **Then** all layers are fully drawn and visible

---

### Edge Cases

- When a NovaIcon has `animation="hover"` but no paths in the icon, component renders normally without animation
- When animation props are invalid (e.g., negative duration), component falls back to default timing
- When multiple NovaIcon instances animate simultaneously, each instance's animation runs independently without interference
- When user changes animation props after initial render, component updates animation timing on next hover
- When icon is changed via `icon` attribute while animation is running, animation resets to new icon's paths

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: NovaIcon component MUST support an `animation` attribute to enable stroke-dash animations
- **FR-002**: Component MUST render SVG paths with `pathLength="1"` when animations are enabled for normalized dash calculations
- **FR-003**: Component MUST apply inline transitions on path elements using CSS custom properties for timing
- **FR-004**: Component MUST trigger animations on hover by changing `--dash-offset` from 1 to 0 on `<use>` elements
- **FR-005**: Component MUST support `duration` attribute for animation length (default: "2.2s")
- **FR-006**: Component MUST support `delay` attribute for animation start delay (default: "0s")
- **FR-007**: Component MUST support `stagger` attribute for sequential path delays (default: "0s")
- **FR-008**: Component MUST implement stagger effects using `--path-index` and `calc()` for transition delays
- **FR-009**: Component MUST respect `prefers-reduced-motion` by disabling animations and showing final state
- **FR-010**: Component MUST support `layers` attribute for multi-layer animations with independent timing
- **FR-011**: Component MUST apply different stroke weights and opacities to animation layers for visual depth
- **FR-012**: Component MUST use `vector-effect: non-scaling-stroke` to maintain consistent stroke widths during scaling
- **FR-013**: The `layers` attribute MUST use comma-separated format like "layer:duration:delay" for each layer

### Key Entities

- **NovaIcon Component**: Web component that renders animated SVG icons with configurable timing
- **Animation Layer**: A group of paths with shared timing properties (duration, delay, stagger)
- **Path Element**: Individual SVG path with `pathLength="1"` and inline transition styles
- **Timing Configuration**: CSS custom properties defining animation behavior (duration, delay, stagger)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can enable basic hover animations on any NovaIcon by setting `animation="hover"` without additional CSS
- **SC-002**: Animation timing can be customized via props, with stagger effects creating sequential path drawing
- **SC-003**: Multi-layer animations render with independent timing, creating visual depth through varying stroke weights
- **SC-004**: All animations respect accessibility preferences, disabling smoothly when `prefers-reduced-motion` is set
- **SC-005**: Animation performance maintains 60 FPS for at least 10 simultaneous instances without visual glitches
- **SC-006**: Component maintains existing API compatibility, with animation features as additive enhancements
