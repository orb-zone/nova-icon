# nova-icon Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-23

## Active Technologies
- TypeScript 5 + Bun (runtime, build, test), TailwindCSS (optional peer) (001-package-setup)
- N/A (static assets only) (001-package-setup)

- TypeScript 5 + Bun, TailwindCSS (001-package-setup)

## Project Structure

```text
src/
  runtime/          - Registry and validation logic
  types/            - TypeScript type definitions
  nova-icon.ts      - Main web component
tests/
  unit/             - Unit tests (mocked, fast)
  integration/      - Integration tests (mocked DOM, run on MRs)
  contract/         - API contract tests
  e2e/              - End-to-end tests (real browsers, run on releases)
    fixtures/       - HTML test fixtures
contracts/          - JSON schemas
specs/              - Feature specifications
```

## Commands

**Unit & Integration Tests (run on MRs):**
```bash
bun run test
# or: bun test tests/unit tests/integration tests/contract
```

**E2E Tests (run on tagged releases):**
```bash
bun run test:e2e           # Run in headless mode
bun run test:e2e:ui        # Run with Playwright UI
bun run test:e2e:headed    # Run in headed mode for debugging
```

**Build:**
```bash
bun run build
```

## Code Style

TypeScript 5: Follow standard conventions

## Recent Changes
- 001-package-setup: Added TypeScript 5 + Bun (runtime, build, test), TailwindCSS (optional peer)

- 001-package-setup: Added TypeScript 5 + Bun, TailwindCSS

<!-- MANUAL ADDITIONS START -->

## SVG Animation Best Practices

Based on proof-of-concept research in svg-icon-deep-dive.md, follow these guidelines for implementing animated SVG icons in nova-icon:

### Core Animation Pattern
- Use CSS custom properties on `<use>` elements to trigger animations via hover.
- Define transitions inline on path elements for reliable shadow DOM compatibility.
- Normalize paths with `pathLength="1"` for consistent dash animations.
- Avoid direct CSS targeting of paths inside `<use>` elements (unreliable across browsers).

### Key Implementation Rules
- **Variable Inheritance**: CSS variables inherit through shadow DOM boundaries; use this for theming and animation triggers.
- **Property Transitions**: Transition actual CSS properties (e.g., `stroke-dashoffset`), not variables themselves.
- **Stagger Effects**: Use `calc()` in `transition-delay` with `--path-index` for sequential animations.
- **Layer Composition**: Use multiple `<use>` elements for background, playground, and foreground layers with independent timing.
- **Accessibility**: Respect `prefers-reduced-motion` by disabling animations and setting final state.
- **Responsive Design**: Apply `vector-effect: non-scaling-stroke` to maintain consistent stroke widths.

### Theming Integration
- Expose CSS custom properties that align with design system tokens (e.g., Nova's `--nova-color-primary`).
- Use `currentColor` for strokes to inherit from Tailwind utilities or parent styles.
- Ensure standalone operation with fallbacks while enabling seamless integration.

### Common Pitfalls to Avoid
- Do not try to animate CSS variables directly (they are not animatable).
- Do not target paths inside `<use>` with external CSS selectors.
- Always use `stroke-dasharray="1 0"` for continuous lines.
- Set `overflow: visible` on icon SVGs to prevent clipping.

For full implementation details, refer to svg-icon-deep-dive.md.

## MCP Servers

This project is configured with Model Context Protocol (MCP) servers to enhance AI assistant capabilities. The configuration is in `.mcp.json` at the project root.

### Available MCP Servers

**Playwright MCP Server** (`@executeautomation/playwright-mcp-server`)
- **Purpose**: Browser automation for real end-to-end testing
- **Use Cases**:
  - Run e2e tests in actual browsers (Chromium, Firefox, WebKit)
  - Verify visual rendering of web components
  - Test animations and interactions in real DOM environments
  - Capture screenshots and debug rendering issues
  - Validate accessibility features in real browsers
  - Performance profiling via Chrome DevTools Protocol (CDP)
  - Profile SVG animation performance and Core Web Vitals
  - Measure paint and layout times
  - Debug CSS animation frame rates

**Filesystem MCP Server** (`@modelcontextprotocol/server-filesystem`)
- **Purpose**: Enhanced file system operations and inspection
- **Use Cases**:
  - Efficient file reading and writing
  - Directory traversal and search
  - File metadata inspection
  - Batch file operations

**Git MCP Server** (`@modelcontextprotocol/server-git`)
- **Purpose**: Repository operations and version control inspection
- **Use Cases**:
  - Query git history and commits
  - Inspect diffs and changes
  - Navigate branches and tags
  - Understand code evolution

**Fetch MCP Server** (`@modelcontextprotocol/server-fetch`)
- **Purpose**: Fetch web content and documentation
- **Use Cases**:
  - Look up Web Components specifications
  - Reference MDN documentation for shadow DOM
  - Research SVG animation standards
  - Verify browser compatibility information

### Testing Strategy

**Integration Tests** (mocked DOM, fast):
- Run on every merge request
- Use Bun's test runner with mocked DOM environment
- Located in `tests/unit/`, `tests/integration/`, `tests/contract/`
- Command: `bun test`

**E2E Tests** (real browsers, comprehensive):
- Run on tagged releases only
- Use Playwright with system browsers
- Test actual rendering, animations, and interactions
- Located in `tests/e2e/`
- Commands: `bun run test:e2e`, `bun run test:e2e:ui`, `bun run test:e2e:headed`

### For AI Assistants

When working on this project:
1. Use **integration tests** for quick validation during development
2. Use **e2e tests** via Playwright MCP for visual/rendering verification
3. Use **Playwright MCP** for performance profiling and animation analysis (includes CDP access)
4. Leverage **filesystem MCP** for efficient code exploration
5. Use **git MCP** to understand code history and recent changes
6. Use **Fetch MCP** to research web standards and API documentation
7. Always run `bun test` before suggesting e2e test runs

<!-- MANUAL ADDITIONS END -->
