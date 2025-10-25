# MCP Server Setup Guide

This document describes the Model Context Protocol (MCP) integration for the nova-icon project.

## Overview

MCP servers enhance AI assistant capabilities by providing structured access to tools like browser automation, filesystem operations, and git repository inspection.

## Configuration

### OpenCode Configuration

**Location**: `opencode.jsonc` in the project root (committed to repository)

The nova-icon project uses OpenCode's native MCP configuration format. All MCP servers are configured in `opencode.jsonc` with the proper schema:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "playwright": {
      "type": "local",
      "command": ["bunx", "-y", "@executeautomation/playwright-mcp-server"],
      "enabled": true
    },
    // ... other servers
  }
}
```

### Initial Setup

**No manual setup required!** The `opencode.jsonc` file is committed and includes absolute paths specific to this project location. If you clone the repository to a different location, you'll need to update the paths:

1. **Update filesystem and git paths** in `opencode.jsonc`:
   ```jsonc
   {
     "mcp": {
       "filesystem": {
         "command": ["bunx", "-y", "@modelcontextprotocol/server-filesystem", "/your/path/to/nova-icon"]
       },
       "git": {
         "command": ["bunx", "-y", "@modelcontextprotocol/server-git", "--repository", "/your/path/to/nova-icon"]
       }
     }
   }
   ```

2. **Playwright and Fetch servers** require no path configuration and work out of the box.

### Legacy Files

The project previously used `.mcp.json` (gitignored) and `.mcp.json.example`. These have been replaced by `opencode.jsonc` which follows OpenCode's native configuration format.

### Configured Servers

#### 1. Playwright MCP Server
**Package**: `@executeautomation/playwright-mcp-server`

**Purpose**: Real browser automation for end-to-end testing

**Capabilities**:
- Run tests in Chromium, Firefox, and WebKit
- Verify visual rendering of web components
- Test animations and interactions in real browsers
- Capture screenshots for debugging
- Validate accessibility in actual DOM environments
- Performance profiling via Chrome DevTools Protocol (CDP)
- Profile SVG animation performance and Core Web Vitals

#### 2. Filesystem MCP Server
**Package**: `@modelcontextprotocol/server-filesystem`

**Purpose**: Enhanced file system operations

**Capabilities**:
- Efficient file reading and writing
- Directory traversal and search
- File metadata inspection
- Batch file operations

#### 3. Git MCP Server
**Package**: `@modelcontextprotocol/server-git`

**Purpose**: Repository inspection and version control

**Capabilities**:
- Query git history and commits
- Inspect diffs and changes
- Navigate branches and tags
- Understand code evolution

#### 4. Fetch MCP Server
**Package**: `@modelcontextprotocol/server-fetch`

**Purpose**: Fetch web content and documentation

**Capabilities**:
- Retrieve web pages and API responses
- Access documentation (MDN, W3C specs)
- Research web standards and best practices
- Fetch external resources for testing

**Use Cases for nova-icon**:
- Look up Web Components specifications
- Reference MDN documentation for shadow DOM
- Research SVG animation standards
- Verify browser compatibility information

## E2E Testing Setup

### Prerequisites
1. **System Browsers**: The Playwright config uses system-installed browsers (Chrome, Firefox, Safari)
2. **Built Component**: E2E tests require the built component in `dist/`

### Test Structure
```
tests/e2e.disabled/        # Currently disabled pending light DOM refactor
└── nova-icon.spec.ts      # E2E test suite (skipped)
```

**Note**: E2E tests are currently disabled as the component is being refactored from Shadow DOM to light DOM pattern.

### Running E2E Tests

**Build first** (required):
```bash
bun run build
```

**Run tests** (currently all skipped):
```bash
bun run test:e2e           # Headless mode (CI)
bun run test:e2e:ui        # Interactive UI mode
bun run test:e2e:headed    # Headed mode for debugging
```

### Test Coverage (Pending Refactor)

The E2E tests will verify (once re-enabled):
- ✅ Component rendering in light DOM (no shadow DOM)
- ✅ Size attribute changes (24px, 48px, 96px)
- ✅ Color attribute application
- ✅ SVG `<use>` element references to shared symbols
- ✅ Accessibility attributes (ARIA)
- ✅ Dynamic attribute updates
- ✅ Animated icon support via CSS variables
- ✅ Component visibility and display properties
- ✅ Tailwind class compatibility

## Testing Strategy

### Integration Tests (Fast, Mocked)
- **When**: Run on every merge request
- **How**: `bun test`
- **Location**: `tests/unit/`, `tests/integration/`, `tests/contract/`
- **Environment**: Mocked DOM with Bun test runner
- **Status**: ✅ 30 passing, 6 skipped (pending light DOM refactor)

### E2E Tests (Comprehensive, Real Browsers)
- **When**: Run on tagged releases
- **How**: `bun run test:e2e`
- **Location**: `tests/e2e.disabled/`
- **Environment**: Real browsers (Chromium, Firefox, WebKit)
- **Status**: ⏸️ Disabled pending light DOM refactor

## For AI Assistants

When working with this project:

1. **Quick validation**: Use `bun test` for fast feedback
2. **Visual verification**: Use Playwright MCP for rendering tests and performance profiling
3. **Code exploration**: Leverage filesystem MCP for efficient navigation
4. **History inspection**: Use git MCP to understand changes
5. **Documentation lookup**: Use Fetch MCP to research web standards and APIs
6. **Before e2e tests**: Always run `bun run build` first
7. **Performance profiling**: Use Playwright MCP with CDP access for animation analysis

## Configuration Files

- `opencode.jsonc` - OpenCode MCP server configuration (committed)
- `playwright.config.ts` - Playwright test configuration
- `tests/e2e.disabled/nova-icon.spec.ts` - E2E test suite (disabled)

## Artifacts

Playwright generates these artifacts (gitignored):
- `playwright-report/` - HTML test reports
- `test-results/` - Test execution results
- `playwright/.cache/` - Playwright cache

## Notes

- System browsers are used (no auto-download)
- Tests run in parallel by default
- CI mode uses sequential execution with retries
- Component uses light DOM (no Web Component Shadow DOM) for Tailwind compatibility
- Shared `<defs>` with `<use>` pattern matches `concept-example.html` design

## Migration from Legacy Config

If you have an old `.mcp.json` file:

1. Delete `.mcp.json` (gitignored)
2. Use `opencode.jsonc` instead (committed)
3. Update paths if your project location differs from the committed config
4. OpenCode will automatically detect and use `opencode.jsonc`

For more information on OpenCode MCP configuration, see: https://opencode.ai/docs/mcp-servers/
