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
- Build the TypeScript source to ESM format only (no CommonJS/UMD).
- Run tests using Bun's built-in test runner.
- Generate type definitions.
- Ensure compatibility with TailwindCSS (declared as optional peer dependency).
- Provide clear installation and usage instructions.
- Optimize core component for performance; final bundle size controlled by user's icon selection.

## Functional Requirements
- The package should be installable via JSR.io (not npm).
- Users should be able to import and use the web component in their projects.
- Support for animated SVG icons with customizable properties.
- Support "bring-your-own" SVG paths via:
  - Build-time: CLI/plugin to generate unified `<defs>` from user SVG sources
  - Runtime: Registration API for dynamic SVG path registration
  - Configuration: JSON/config file support for declarative icon definitions

## Technical Requirements
- Use Bun for building and testing (built-in test runner via `bun test`).
- Output to dist/ directory as ESM module format (.js with "type": "module" in package.json).
- Include TypeScript source files in package for JSR.io publication.
- Declare TailwindCSS as optional peer dependency in package.json (peerDependenciesMeta.tailwindcss.optional: true).
- Package must include:
  - Core web component (nova-icon.js)
  - Build-time CLI tool for SVG processing
  - TypeScript definitions for runtime registration API
  - JSON schema for configuration file format
- Configure jsr.json for JSR.io publishing.
- Test suite must cover: component rendering, attribute changes, animation triggers, accessibility features, runtime registration API, build-time CLI tool.
- Include README with quickstart guide (JSR.io installation instructions).