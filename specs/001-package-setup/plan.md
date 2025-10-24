# Implementation Plan: Package Setup

**Branch**: `001-package-setup` | **Date**: 2025-10-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-package-setup/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Set up the @orb-zone/nova-icon package for distribution via JSR.io (not npm). The package will provide a web component for animated SVG icons with "bring-your-own" SVG support through build-time CLI tools, runtime registration API, and configuration files. Build system uses Bun to output ESM-only format with TypeScript definitions. TypeScript source files included for JSR publication. TailwindCSS is an optional peer dependency. Testing uses Bun's built-in test runner.

## Technical Context

**Language/Version**: TypeScript 5  
**Primary Dependencies**: Bun (runtime, build, test), TailwindCSS (optional peer)  
**Storage**: N/A (static assets only)  
**Testing**: Bun's built-in test runner (`bun test`)  
**Target Platform**: Modern browsers (ESM support required)  
**Project Type**: Single library package  
**Performance Goals**: Core component optimized; bundle size user-controlled via icon selection  
**Constraints**: ESM-only output, no shadow DOM for Tailwind compatibility, cross-browser SVG animation support  
**Scale/Scope**: Single web component package with CLI tooling

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Library-First
**Status**: PASS  
Package is a standalone library (`@orb-zone/nova-icon`) with clear purpose: animated SVG icon web component. Self-contained, independently testable, documented.

### ✅ II. CLI Interface
**Status**: PASS  
Build-time CLI tool for SVG processing (per spec lines 38, 40). Will follow stdin/args → stdout protocol with JSON + human-readable output.

### ✅ III. Test-First (NON-NEGOTIABLE)
**Status**: PASS - Deferred to implementation  
TDD workflow will be enforced during implementation. Test coverage specified: component rendering, attribute changes, animation triggers, accessibility, runtime API, CLI tool (spec line 41).

### ✅ IV. Integration Testing
**Status**: PASS  
Contract tests required for:
- Runtime registration API (new library contract)
- CLI tool output format (new library contract)
- Configuration file schema (shared schema)

### ✅ V. Simplicity
**Status**: PASS  
Starting with minimal package setup. Core component + CLI + config schema. YAGNI applied.

### ✅ Technology Stack Requirements
**Status**: PASS  
- TypeScript 5 ✓
- Bun for runtime, building, testing ✓
- TailwindCSS for styling (optional peer) ✓
- SVG animations via CSS custom properties ✓

### ✅ Development Workflow
**Status**: PASS  
Testing gates will be enforced (unit, integration, accessibility checks for `prefers-reduced-motion`).

**Re-evaluation checkpoint**: After Phase 1 design complete.

---

## Constitution Re-Check (Post-Phase 1 Design)

**Date**: 2025-10-24  
**Status**: All gates remain PASS

### ✅ I. Library-First
**Status**: PASS  
Package structure confirmed:
- Standalone library with clear purpose
- Self-contained: core component + CLI + runtime API
- Independently testable (unit, integration, contract tests)
- Fully documented (data-model.md, quickstart.md, schema)

### ✅ II. CLI Interface
**Status**: PASS  
CLI design complete:
- stdin/args → stdout protocol implemented via `cac`
- Text output: JSON flag for machine-readable, pretty-print for humans
- Errors to stderr with exit codes
- Tools: svgo (optimization) + linkedom (parsing)

### ✅ III. Test-First (NON-NEGOTIABLE)
**Status**: PASS  
Test requirements specified in data-model.md and research.md:
- Component lifecycle tests (connect, disconnect, attribute changes)
- Animation trigger tests (hover, prefers-reduced-motion)
- Runtime API tests (register, registerBatch, deduplication)
- CLI tool tests (stdin, file input, optimization)
- Contract tests (JSON schema validation)
- Accessibility tests (ARIA, reduced motion)

### ✅ IV. Integration Testing
**Status**: PASS  
Contract tests defined:
- Runtime API contract: register methods, return types, error handling
- CLI API contract: input formats, output formats, exit codes
- Configuration schema contract: JSON Schema Draft 2020-12 with Ajv validation
- Component attribute contract: icon, size, color, layers

### ✅ V. Simplicity
**Status**: PASS  
Design maintains simplicity:
- Single registry pattern (static methods, no complex state management)
- Document-level singleton `<defs>` (no per-instance duplication)
- ESM-only output (no multi-format complexity)
- Hybrid validation (build + runtime, not multiple layers)
- Standard tools (Bun native, industry standard libraries)

### ✅ Technology Stack Requirements
**Status**: PASS  
Stack confirmed in research.md:
- TypeScript 5 ✓
- Bun for runtime, building (`bun build`), testing (`bun test`) ✓
- TailwindCSS optional peer dependency ✓
- SVG animations via CSS custom properties (per AGENTS.md patterns) ✓

### ✅ Development Workflow
**Status**: PASS  
Workflow requirements satisfied:
- Testing gates defined (unit, integration, contract, accessibility)
- Build process documented (Bun + tsc for types)
- prefers-reduced-motion checks in accessibility requirements
- SVG animation best practices documented in AGENTS.md

**Final Gate Status**: ✅ ALL PASS - Proceed to Phase 2 (task breakdown)

## Project Structure

### Documentation (this feature)

```text
specs/001-package-setup/
├── plan.md              # This file
├── research.md          # Phase 0 output (pending)
├── data-model.md        # Phase 1 output (pending)
├── quickstart.md        # Phase 1 output (pending)
├── contracts/           # Phase 1 output (pending)
└── tasks.md             # Phase 2 output (NOT created by this command)
```

### Source Code (repository root)

```text
src/
├── nova-icon.ts         # Core web component
├── cli/
│   └── process-svg.ts   # Build-time SVG processing CLI
├── runtime/
│   └── registry.ts      # Runtime registration API
└── types/
    └── index.d.ts       # TypeScript definitions

tests/
├── unit/
│   ├── component.test.ts
│   ├── cli.test.ts
│   └── registry.test.ts
├── integration/
│   ├── build-time.test.ts
│   └── runtime.test.ts
└── contract/
    ├── api-contract.test.ts
    └── config-schema.test.ts

dist/                    # Build output (ESM)
├── nova-icon.js
├── nova-icon.d.ts
└── cli.js

contracts/
└── component-schema.json  # Icon configuration schema
```

**Structure Decision**: Single project structure selected. This is a standalone library package, not a web application or mobile project. Core component, CLI tooling, and tests are co-located in standard library layout.

## Complexity Tracking

No constitution violations. Complexity tracking not required.

---

## Phase 0: Research

### Research Tasks

1. **Bun Build Configuration**
   - Research: How to configure Bun for ESM-only output with TypeScript definitions
   - Output: Build script configuration for package.json

2. **CLI Design Patterns**
   - Research: Best practices for Node.js CLI tools (stdin/stdout protocol, arg parsing)
   - Research: SVG processing libraries compatible with Bun
   - Output: CLI architecture pattern

3. **Runtime Registration API Pattern**
   - Research: Web component API patterns for dynamic content registration
   - Research: Shared `<defs>` management across component instances
   - Output: API design pattern

4. **Configuration File Format**
   - Research: JSON schema best practices for icon definitions
   - Research: Validation approaches (runtime vs build-time)
   - Output: Schema structure and validation strategy

5. **Package.json Best Practices**
   - Research: ESM package.json configuration ("type": "module", exports field)
   - Research: Peer dependency configuration for optional TailwindCSS
   - Output: Complete package.json structure

### Deliverable

`research.md` with consolidated findings, decisions, rationales, and alternatives for all research tasks above.

---

## Phase 1: Design & Contracts

**Prerequisites**: research.md complete

### 1. Data Model (`data-model.md`)

Entities to define:
- **IconDefinition**: name, paths, metadata
- **LayerConfig**: weight, opacity, duration, delay, stagger
- **ComponentState**: registered icons, active icon, animation state

Fields, validation rules, relationships per functional requirements.

### 2. API Contracts (`/contracts/`)

Based on functional requirements:

**Runtime API**:
- `NovaIcon.register(name: string, svgPath: string, options?: IconOptions): void`
- Component attributes: `icon`, `size`, `color`, `layers`

**CLI API**:
- Input: SVG file paths or directory
- Output: Unified `<defs>` JSON or ESM module
- Format: JSON schema

**Configuration File**:
- JSON schema for icon definitions
- Validation rules

Generate:
- `contracts/component-schema.json` (icon configuration format)
- `contracts/cli-api.md` (CLI interface specification)
- `contracts/runtime-api.md` (Registration API specification)

### 3. Quickstart Guide (`quickstart.md`)

Minimal working example:
```typescript
import '@orb-zone/nova-icon';

// Runtime usage
NovaIcon.register('custom', 'M10 10 L20 20');

// HTML
<nova-icon icon="custom" size="240px" color="gold"></nova-icon>
```

### 4. Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh opencode` to update CLAUDE.md with:
- TypeScript 5 + Bun
- TailwindCSS (optional peer)
- Testing: `bun test`

---

## Phase 2: Task Breakdown

**NOT executed by this command.** Run `/speckit.tasks` after Phase 1 complete.

---

## Constitution Re-Check (Post-Design)

To be performed after Phase 1 artifacts generated. Verify:
- CLI follows stdin/stdout protocol ✓
- Runtime API follows web component standards ✓
- Test contracts defined ✓
- Simplicity maintained ✓
