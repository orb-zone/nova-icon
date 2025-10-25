# @orb-zone/nova-icon

A reusable web-component for animated SVG icons compatible with Nova Design System.

**✨ Features:**
- 🚀 **Light DOM Rendering** - No shadow DOM barriers, seamless styling
- 🎨 **Tailwind Native** - Utility classes work directly on components
- 🔗 **Efficient Symbol Sharing** - Each icon stored once, referenced N times via `<use>`
- ♿ **Accessibility First** - Respects `prefers-reduced-motion` automatically
- 📦 **Zero Dependencies** - Pure Web Components, works everywhere

## Installation

Install via JSR.io:

```bash
# Node.js/Bun
npx jsr add @orb-zone/nova-icon

# Deno
deno add @orb-zone/nova-icon
```

## Quickstart

```typescript
import { NovaIconRegistry } from '@orb-zone/nova-icon';

// Register icons
NovaIconRegistry.register('star', 
  '<path d="M12 2 L15 10 L23 10 L17 14 L19 22 L12 18 L5 22 L7 14 L1 10 L9 10 Z"/>',
  { viewBox: '0 0 24 24' }
);

// Use in HTML with Tailwind classes
<nova-icon icon="star" class="w-8 h-8 text-yellow-500"></nova-icon>
```

### Light DOM Architecture

NovaIcon renders directly to **light DOM** (not shadow DOM), which means:
- ✅ Tailwind CSS utility classes work directly
- ✅ CSS custom properties inherit naturally
- ✅ Simpler DevTools inspection
- ✅ Standard CSS selectors work

**Before (shadow DOM):**
```html
<nova-icon icon="star">
  #shadow-root
    <svg>...</svg>
</nova-icon>
```

**After (light DOM):**
```html
<nova-icon icon="star" class="w-8 h-8 text-blue-500">
  <svg><use href="#star"></use></svg>
</nova-icon>
```

## Examples

Interactive examples available in `/examples`:

```bash
bun run build
bun run examples
```

View live demos at http://localhost:8080

For more documentation, see [specs/002-light-dom-refactor/quickstart.md](specs/002-light-dom-refactor/quickstart.md).

## Development Setup

### MCP Server Configuration (Optional)

This project supports [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers for enhanced AI assistant capabilities. If you're using an AI assistant that supports MCP:

1. **Copy the example configuration:**
   ```bash
   cp .mcp.json.example .mcp.json
   ```

2. **Update the paths** in `.mcp.json` to your local repository path:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "/your/path/to/nova-icon"]
       },
       "git": {
         "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "/your/path/to/nova-icon"]
       }
     }
   }
   ```

3. **Configured servers:**
   - **Playwright**: Browser automation for E2E testing
   - **Filesystem**: Enhanced file operations
   - **Git**: Repository inspection

See [MCP_SETUP.md](MCP_SETUP.md) for detailed information.

### Running Tests

**Integration tests** (fast, mocked DOM):
```bash
bun test
```

**E2E tests** (real browsers):
```bash
bun run build        # Build first
bun run test:e2e     # Run E2E tests
```
