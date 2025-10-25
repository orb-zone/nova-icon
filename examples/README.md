# NovaIcon Examples

Interactive examples demonstrating NovaIcon features and capabilities.

## Quick Start

1. **Build the project** (from repository root):
   ```bash
   bun run build
   ```

2. **Start the example server**:
   ```bash
   bun run examples
   ```

3. **Open your browser** to http://localhost:8080

The server will automatically open the index page which provides links to all examples.

## Examples

### ✅ Complete Examples

- **index.html** - Landing page with overview and navigation
- **basic-usage.html** - Register and render icons with attributes
- **tailwind-integration.html** - Tailwind CSS utility classes

### 🚧 Coming Soon

- **animations.html** - SVG path animations and transitions
- **responsive.html** - Responsive sizing with breakpoints
- **theming.html** - Dark mode and CSS variable theming
- **accessibility.html** - Reduced motion and ARIA best practices

## File Structure

```
examples/
├── index.html              # Main landing page
├── shared.js               # Shared icon definitions
├── basic-usage.html        # Basic usage examples
├── tailwind-integration.html   # Tailwind examples
└── [other examples].html   # Additional examples
```

## Development

The examples reference `../dist/nova-icon.js`, so make sure to:

1. Build the project first: `bun run build`
2. Rebuild after making changes to source code
3. Use `bun run dev` in another terminal for auto-rebuild during development

## Adding New Examples

1. Create a new HTML file in `examples/`
2. Import icons from `shared.js` or register custom ones
3. Load NovaIcon from `../dist/nova-icon.js`
4. Add a link to the new example in `index.html`

## Notes

- Examples use Tailwind CSS CDN for styling
- All examples are standalone HTML files (no build step required for examples themselves)
- Icons are registered via ES modules in each example
