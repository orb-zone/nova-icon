# NovaIcon Examples

Interactive examples demonstrating NovaIcon features and capabilities.

## Quick Start

**Start the example server** (from repository root):
```bash
bun run examples
```

This will:
1. Build the project (`dist/`)
2. Copy the build to `examples/dist/`
3. Start the HTTP server on http://localhost:8080
4. Automatically open your browser

The server will open the index page which provides links to all examples.

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
├── index.html                  # Main landing page
├── shared.js                   # Shared icon definitions
├── basic-usage.html            # Basic usage examples
├── tailwind-integration.html   # Tailwind examples
├── dist/                       # Build artifacts (auto-copied, gitignored)
└── [other examples].html       # Additional examples
```

## Development

The examples reference `./dist/nova-icon.js` (copied from root `dist/`).

**Development workflow:**

1. Make changes to source code in `src/`
2. Run `bun run examples` to rebuild and serve
3. The script automatically rebuilds and copies files

**Alternative (watch mode):**
```bash
# Terminal 1: Auto-rebuild on changes
bun run dev

# Terminal 2: Manually copy when needed and serve
cp -r dist examples/ && bunx http-server ./examples -p 8080
```

**Clean up:**
```bash
bun run examples:clean  # Remove examples/dist
```

## Adding New Examples

1. Create a new HTML file in `examples/`
2. Import icons from `shared.js` or register custom ones
3. Load NovaIcon from `../dist/nova-icon.js`
4. Add a link to the new example in `index.html`

## Notes

- Examples use Tailwind CSS CDN for styling
- All examples are standalone HTML files (no build step required for examples themselves)
- Icons are registered via ES modules in each example
