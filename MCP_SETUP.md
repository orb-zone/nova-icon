# MCP Server Setup Guide

This document describes the Model Context Protocol (MCP) integration for the nova-icon project.

## Overview

MCP servers enhance AI assistant capabilities by providing structured access to tools like browser automation, filesystem operations, and git repository inspection.

## Configuration

### Initial Setup

**Important**: The `.mcp.json` file contains machine-specific paths and is gitignored.

1. **Copy the example configuration:**
   ```bash
   cp .mcp.json.example .mcp.json
   ```

2. **Update the paths** in `.mcp.json`:
   Replace `/absolute/path/to/nova-icon` with your actual local repository path:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/path/to/nova-icon"]
       },
       "git": {
         "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "/Users/yourname/path/to/nova-icon"]
       }
     }
   }
   ```

3. **The Playwright server** requires no path configuration and works out of the box.

### Location
`.mcp.json` in the project root (gitignored, created from `.mcp.json.example`)

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

## E2E Testing Setup

### Prerequisites
1. **System Browsers**: The Playwright config uses system-installed browsers (Chrome, Firefox, Safari)
2. **Built Component**: E2E tests require the built component in `dist/`

### Test Structure
```
tests/e2e/
├── fixtures/
│   └── test-page.html    # Clean HTML test fixture
└── nova-icon.spec.ts      # E2E test suite
```

### Running E2E Tests

**Build first** (required):
```bash
bun run build
```

**Run tests**:
```bash
npm run test:e2e           # Headless mode (CI)
npm run test:e2e:ui        # Interactive UI mode
npm run test:e2e:headed    # Headed mode for debugging
```

### Test Coverage

The E2E tests verify:
- ✅ Component rendering in shadow DOM
- ✅ Size attribute changes (24px, 48px, 96px)
- ✅ Color attribute application
- ✅ SVG element presence in shadow root
- ✅ Accessibility attributes (ARIA)
- ✅ Dynamic attribute updates
- ✅ Animated icon support
- ✅ Component visibility and display properties

## Testing Strategy

### Integration Tests (Fast, Mocked)
- **When**: Run on every merge request
- **How**: `bun test`
- **Location**: `tests/unit/`, `tests/integration/`, `tests/contract/`
- **Environment**: Mocked DOM with Bun test runner

### E2E Tests (Comprehensive, Real Browsers)
- **When**: Run on tagged releases
- **How**: `npm run test:e2e`
- **Location**: `tests/e2e/`
- **Environment**: Real browsers (Chromium, Firefox, WebKit)

## For AI Assistants

When working with this project:

1. **Quick validation**: Use `bun test` for fast feedback
2. **Visual verification**: Use Playwright MCP for rendering tests
3. **Code exploration**: Leverage filesystem MCP for efficient navigation
4. **History inspection**: Use git MCP to understand changes
5. **Before e2e tests**: Always run `bun run build` first

## Configuration Files

- `.mcp.json` - MCP server configuration
- `playwright.config.ts` - Playwright test configuration
- `tests/e2e/fixtures/test-page.html` - Clean HTML fixture for testing
- `tests/e2e/nova-icon.spec.ts` - E2E test suite

## Artifacts

Playwright generates these artifacts (gitignored):
- `playwright-report/` - HTML test reports
- `test-results/` - Test execution results
- `playwright/.cache/` - Playwright cache

## Notes

- System browsers are used (no auto-download)
- Tests run in parallel by default
- CI mode uses sequential execution with retries
- Test fixture is separate from `concept-example.html` (which preserves original intent)
