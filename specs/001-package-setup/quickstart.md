# Quickstart Guide

## Installation

Install the package via JSR.io:

```bash
# Node.js/Bun
npx jsr add @orb-zone/nova-icon

# Deno
deno add @orb-zone/nova-icon

# Or use directly from JSR
import '@orb-zone/nova-icon' from 'jsr:@orb-zone/nova-icon';
```

## Basic Usage

### 1. Register Icons

Register custom SVG paths at runtime:

```javascript
import '@orb-zone/nova-icon';

// Register a single icon
NovaIcon.register('custom-arrow', 'M5 12h14 M12 5l7 7-7 7', {
  viewBox: '0 0 24 24'
});

// Or batch register multiple icons
NovaIcon.registerBatch([
  { 
    name: 'check', 
    pathData: 'M20 6L9 17l-5-5',
    options: { viewBox: '0 0 24 24' }
  },
  { 
    name: 'star', 
    pathData: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
  }
]);
```

### 2. Use in HTML

```html
<nova-icon icon="custom-arrow" size="240px" color="gold"></nova-icon>
```

### 3. With Configuration File (Build-time)

Create an `icons.config.json`:

```json
{
  "icons": {
    "arrow-right": {
      "paths": [
        "M5 12h14",
        "M12 5l7 7-7 7"
      ],
      "viewBox": "0 0 24 24",
      "layers": [
        { "weight": 1, "duration": 300 },
        { "weight": 2, "duration": 400, "stagger": 100 }
      ]
    }
  }
}
```

Process with CLI:

```bash
nova-icon icons.config.json --output icons-generated.js
```

Then import the generated file:

```javascript
import './icons-generated.js'; // Auto-registers icons
```

## Component Attributes

- `icon` (required): Name of the registered icon
- `size`: Icon size (default: "24px") - accepts CSS units
- `color`: Icon color (default: "currentColor") - any valid CSS color
- `layers`: JSON string to override layer configurations (optional)

## Advanced Usage

### Custom Layer Configuration

```html
<nova-icon 
  icon="custom-arrow" 
  size="48px" 
  color="#3b82f6"
  layers='[{"weight": 1.5, "duration": 500, "stagger": 75}]'>
</nova-icon>
```

### With TailwindCSS

```html
<nova-icon 
  icon="check" 
  class="w-12 h-12 text-blue-500 hover:text-blue-700">
</nova-icon>
```

### Programmatic Usage

```javascript
const icon = document.createElement('nova-icon');
icon.setAttribute('icon', 'star');
icon.setAttribute('size', '32px');
icon.setAttribute('color', '#fbbf24');
document.body.appendChild(icon);
```

## Building from Source

Clone and build:

```bash
git clone <repository-url>
cd nova-icon
bun install
bun run build
```

## Testing

Run the test suite:

```bash
bun test
```

## CLI Tool

Process SVG files or directories:

```bash
# Single file
nova-icon path/to/icon.svg --output processed.js

# Multiple files
nova-icon icons/*.svg --optimize --json

# From stdin
cat icon.svg | nova-icon --optimize

# From config file
nova-icon icons.config.json --output dist/icons.js
```

### CLI Options

- `--output <file>`: Output file (default: stdout)
- `--optimize`: Run SVGO optimization
- `--json`: Output as JSON format
- `--help`: Show help message

## Accessibility

The component automatically:
- Respects `prefers-reduced-motion` (disables animations)
- Adds appropriate ARIA attributes
- Maintains focus visibility
- Uses semantic SVG markup

## Browser Support

Modern browsers with ESM and Web Components support:
- Chrome 63+
- Firefox 63+
- Safari 11.1+
- Edge 79+

## Next Steps

- See [data-model.md](./data-model.md) for detailed entity definitions
- See [contracts/component-schema.json](./contracts/component-schema.json) for configuration schema
- Check [AGENTS.md](../../AGENTS.md) for SVG animation implementation patterns
