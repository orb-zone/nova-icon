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
