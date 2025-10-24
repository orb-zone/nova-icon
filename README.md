# @orb-zone/nova-icon

A reusable web-component for animated SVG icons compatible with Nova Design System.

## Installation

Install via JSR.io:

```bash
# Node.js/Bun
npx jsr add @orb-zone/nova-icon

# Deno
deno add @orb-zone/nova-icon
```

## Quickstart

Import and use the web component:

```typescript
import '@orb-zone/nova-icon';

// Register a custom icon
NovaIcon.register('custom', 'M10 10 L20 20');

// Use in HTML
<nova-icon icon="custom" size="240px" color="gold"></nova-icon>
```

For more examples, see [quickstart.md](specs/001-package-setup/quickstart.md).
