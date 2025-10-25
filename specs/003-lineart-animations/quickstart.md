# Quickstart: Lineart Animations

## Basic Usage
Add stroke-dash animations to NovaIcon components.

```html
<nova-icon icon="heart" animation="hover"></nova-icon>
```

## Custom Timing
```html
<nova-icon icon="star" animation="hover" duration="1s" stagger="0.1s"></nova-icon>
```

## Multi-Layer Animations
```html
<nova-icon icon="complex" animation="hover" layers="bg:2s,pg:1s:0.5s,fg:0.5s:1s"></nova-icon>
```

## Accessibility
Animations automatically disable if user has `prefers-reduced-motion: reduce`.

## Testing
Run tests: `bun test`

## Implementation Notes
- Uses CSS custom properties for timing.
- No Shadow DOM for Tailwind compatibility.
- Inline transitions for reliability.