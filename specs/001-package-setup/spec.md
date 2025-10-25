# Feature Spec: Package Setup

## Overview
Set up the package for the nova-icon web component to ensure proper build, testing, distribution, and documentation.

## Clarifications

### Session 2025-10-24
- Q: What output format(s) should the build produce? → A: ESM only
- Q: How should TailwindCSS be declared in package.json? → A: Peer dependency (optional, user provides if needed)
- Q: How should custom "bring-your-own" SVG paths be handled? → A: Hybrid (build-time generation + runtime registration) with configuration file support
- Q: What bundle size target should be set? → A: No hard cap; optimize core component and let users control size via icon selection
- Q: Which testing framework should be used? → A: Bun's built-in test runner
- Q: Where should the package be published? → A: JSR.io only (not npm), per constitution Distribution & Publishing policy

## Requirements
- Run tests using Bun's built-in test runner.
- Generate type definitions for all exported APIs.
- Ensure compatibility with TailwindCSS (declared as optional peer dependency).
- Provide installation and usage quickstart in README (full API documentation deferred to post-MVP).
- Optimize core component for performance with measurable targets: 60 FPS animations with <1% dropped frames, <50KB per icon SVG, hardware-accelerated CSS transforms.

## Functional Requirements
- The package should be installable via JSR.io (not npm).
- Users should be able to import and use the web component in their projects.
- Support for animated SVG icons with customizable properties: stroke weight, opacity, animation duration, animation delay, and stagger timing between layers.
- Support "bring-your-own" SVG paths via:
  - Runtime: Registration API for dynamic SVG path registration (MVP - Phase 3)
  - Build-time: CLI tool to generate unified `<defs>` from user SVG sources (post-MVP - Phase 5)
  - Configuration: JSON/config file support for declarative icon definitions (validation only in MVP - Phase 2)

## Technical Requirements
- Build the TypeScript source to ESM format only (no CommonJS/UMD).
- Use Bun for building and testing (built-in test runner via `bun test`).
- Output to dist/ directory as ESM module format (.js with "type": "module" in package.json).
- Include TypeScript source files in package for JSR.io publication.
- Declare TailwindCSS as optional peer dependency in package.json (peerDependenciesMeta.tailwindcss.optional: true).
- **No Web Component Shadow DOM**: Render SVG directly in light DOM for Tailwind compatibility (CSS classes must flow naturally to component).
- Use shared `<defs>` container with `<symbol>` elements; components reference via `<use>` elements (efficient, matches concept-example.html pattern).
- Package must include:
  - Core web component (nova-icon.js)
  - TypeScript definitions for runtime registration API
  - JSON schema for configuration file format
  - Build-time CLI tool for SVG processing (post-MVP)
- Configure jsr.json for JSR.io publishing.
- Test suite must cover: component rendering, attribute changes, animation triggers, accessibility features (prefers-reduced-motion), runtime registration API, configuration schema validation.
- Include README with quickstart guide (JSR.io installation instructions and basic usage examples).