# Component API Contract: NovaIcon Animations

## Overview
NovaIcon web component supports stroke-dash animations via attributes. This contract defines the expected behavior and validation.

## Attributes Schema

```json
{
  "type": "object",
  "properties": {
    "animation": {
      "type": "string",
      "enum": ["hover"],
      "description": "Enables stroke-dash animations on hover."
    },
    "duration": {
      "type": "string",
      "pattern": "^\\d+(\\.\\d+)?s$",
      "default": "2.2s",
      "description": "Animation duration (e.g., '1s', '0.5s')."
    },
    "delay": {
      "type": "string",
      "pattern": "^\\d+(\\.\\d+)?s$",
      "default": "0s",
      "description": "Animation start delay."
    },
    "stagger": {
      "type": "string",
      "pattern": "^\\d+(\\.\\d+)?s$",
      "default": "0s",
      "description": "Delay between sequential path animations."
    },
    "layers": {
      "type": "string",
      "pattern": "^([a-z]+:\\d+(\\.\\d+)?s(:\\d+(\\.\\d+)?s)?,)*[a-z]+:\\d+(\\.\\d+)?s(:\\d+(\\.\\d+)?s)?$",
      "description": "Comma-separated layer definitions: 'layer:duration:delay'."
    },
    "icon": {
      "type": "string",
      "description": "SVG icon identifier."
    }
  },
  "required": ["icon"]
}
```

## Behavior Contract
- On hover, animate stroke-dashoffset from 1 to 0.
- Respect prefers-reduced-motion: disable animations.
- Use vector-effect: non-scaling-stroke.
- Inline transitions on path elements.

## Validation Rules
- Invalid time values fall back to defaults.
- No paths: Render normally without animation.
- Multiple instances: Animate independently.