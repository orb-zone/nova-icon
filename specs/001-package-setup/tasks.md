# Tasks: Package Setup

**Input**: Design documents from `/specs/001-package-setup/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-schema.json

**Tests**: Test tasks included per constitution requirement (Test-First NON-NEGOTIABLE)

**Organization**: Tasks organized by package component to enable independent implementation and testing

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

Repository root structure (single project):
- `src/` - Source code
- `tests/` - Test files
- `dist/` - Build output
- `contracts/` - JSON schemas

---

## Phase 1: Project Foundation

**Purpose**: Initialize package structure and configuration files for JSR.io distribution

- [X] T001 Update package.json with JSR.io publishing configuration (exports, "type": "module", files whitelist)
- [X] T002 Create jsr.json configuration file for JSR.io publishing with proper exports mapping
- [X] T003 [P] Update tsconfig.json for declaration file generation (emitDeclarationOnly, declarationDir)
- [X] T004 [P] Install runtime dependencies: ajv, ajv-formats, cac, linkedom, svgo in package.json
- [X] T005 [P] Add build scripts to package.json: build, build:bundle, build:cli, build:types
- [X] T006 [P] Create README.md with JSR.io installation instructions and quickstart examples

**Checkpoint**: Foundation ready - package configuration complete ✅

---

## Phase 2: JSON Schema & Validation (Component: Configuration)

**Purpose**: Icon configuration schema and validation infrastructure

### Tests for Configuration Schema

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T007 [P] Contract test for JSON Schema validation in tests/contract/config-schema.test.ts
- [X] T008 [P] Unit test for schema validation (valid configs) in tests/unit/schema-validation.test.ts
- [X] T009 [P] Unit test for schema validation (invalid configs) in tests/unit/schema-validation-errors.test.ts

### Implementation for Configuration Schema

- [X] T010 [P] Create TypeScript types from data-model.md in src/types/index.d.ts (IconDefinition, LayerConfig, IconConfig, IconEntry)
- [X] T011 Implement schema validation module in src/runtime/validator.ts using Ajv v8

**Independent Test**: Load example config, validate with schema, should pass/fail as expected

**Checkpoint**: Configuration schema validated and working ✅

---

## Phase 3: Runtime Registration API (Component: Registry)

**Purpose**: Static registry for runtime icon registration

### Tests for Runtime Registration API

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T012 [P] Contract test for NovaIcon.register() API in tests/contract/api-contract.test.ts
- [X] T013 [P] Integration test for singleton defs container creation in tests/integration/runtime.test.ts
- [X] T014 [P] Unit test for registry operations (register, get, has) in tests/unit/registry.test.ts
- [X] T015 [P] Unit test for duplicate icon handling in tests/unit/registry-duplicates.test.ts
- [X] T016 [P] Unit test for batch registration in tests/unit/registry-batch.test.ts

### Implementation for Runtime Registration API

- [X] T017 Create runtime registry module in src/runtime/registry.ts (static methods, Map storage)
- [X] T018 Implement getDefsContainer() method for singleton <svg><defs> management in src/runtime/registry.ts
- [X] T019 Implement register() method with duplicate checking in src/runtime/registry.ts
- [X] T020 Implement registerBatch() method with fragment optimization in src/runtime/registry.ts
- [X] T021 [P] Implement get() and has() helper methods in src/runtime/registry.ts

**Independent Test**: Register icons at runtime, verify <defs> container created, symbols accessible

**Checkpoint**: Runtime registration API complete and tested ✅

---

## Phase 4: Web Component (Component: NovaIcon Element)

**Purpose**: Core <nova-icon> custom element

### Tests for Web Component

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T022 [P] Unit test for component lifecycle (connectedCallback, disconnectedCallback) in tests/unit/component.test.ts
- [ ] T023 [P] Unit test for attribute changes (icon, size, color) in tests/unit/component-attributes.test.ts
- [ ] T024 [P] Unit test for prefers-reduced-motion support in tests/unit/component-accessibility.test.ts
- [ ] T025 [P] Integration test for component rendering with registered icons in tests/integration/component-rendering.test.ts
- [ ] T026 [P] Integration test for hover animations in tests/integration/component-animation.test.ts

### Implementation for Web Component

- [ ] T027 Create NovaIcon custom element class in src/nova-icon.ts extending HTMLElement
- [ ] T028 Implement observedAttributes and attributeChangedCallback in src/nova-icon.ts
- [ ] T029 Implement connectedCallback with icon rendering logic in src/nova-icon.ts
- [ ] T030 Implement disconnectedCallback with cleanup in src/nova-icon.ts
- [ ] T031 Implement SVG <use> element creation and attribute binding in src/nova-icon.ts
- [ ] T032 Implement prefers-reduced-motion media query detection in src/nova-icon.ts
- [ ] T033 Implement CSS custom properties for animation control in src/nova-icon.ts
- [ ] T034 Register custom element with customElements.define('nova-icon', NovaIcon) in src/nova-icon.ts

**Independent Test**: Create <nova-icon> element, set attributes, verify rendering and animations

**Checkpoint**: Web component fully functional

---

## Phase 5: CLI Tool (Component: SVG Processing)

**Purpose**: Build-time CLI for SVG processing and optimization

### Tests for CLI Tool

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T035 [P] Contract test for CLI output format (JSON mode) in tests/contract/cli-output.test.ts
- [ ] T036 [P] Unit test for argument parsing (cac) in tests/unit/cli.test.ts
- [ ] T037 [P] Unit test for file input processing in tests/unit/cli-files.test.ts
- [ ] T038 [P] Unit test for stdin input processing in tests/unit/cli-stdin.test.ts
- [ ] T039 [P] Unit test for SVGO optimization in tests/unit/cli-optimize.test.ts
- [ ] T040 [P] Integration test for config file processing in tests/integration/build-time.test.ts
- [ ] T041 [P] Integration test for SVG file processing end-to-end in tests/integration/cli-e2e.test.ts

### Implementation for CLI Tool

- [ ] T042 Create CLI entry point with shebang in src/cli/process-svg.ts
- [ ] T043 Implement argument parsing with cac in src/cli/process-svg.ts (--output, --optimize, --json)
- [ ] T044 Implement stdin reader function in src/cli/process-svg.ts
- [ ] T045 Implement file input handler using Bun.file() in src/cli/process-svg.ts
- [ ] T046 Implement SVG parsing with linkedom in src/cli/process-svg.ts
- [ ] T047 Implement SVGO optimization integration in src/cli/process-svg.ts
- [ ] T048 Implement unified <defs> generation from multiple SVGs in src/cli/process-svg.ts
- [ ] T049 Implement dual output format (JSON vs pretty-print) in src/cli/process-svg.ts
- [ ] T050 Implement error handling and stderr output in src/cli/process-svg.ts
- [ ] T051 Add executable permissions and bin entry to package.json for nova-icon command

**Independent Test**: Run CLI with SVG files, verify output format, test stdin mode

**Checkpoint**: CLI tool complete and executable

---

## Phase 6: Build System Integration

**Purpose**: Build scripts and type generation

- [ ] T052 Configure Bun build command for ESM output in package.json scripts (--format esm --packages external)
- [ ] T053 Configure TypeScript compiler for declaration generation in package.json scripts (tsc --emitDeclarationOnly)
- [ ] T054 Test build:bundle script produces dist/nova-icon.js
- [ ] T055 Test build:cli script produces dist/cli.js with shebang
- [ ] T056 Test build:types script produces dist/nova-icon.d.ts
- [ ] T057 Test full build script runs all sub-builds successfully
- [ ] T058 Verify dist/ output includes only necessary files per package.json files whitelist

**Independent Test**: Run `bun run build`, verify all outputs in dist/ directory

**Checkpoint**: Build system validated

---

## Phase 7: Documentation & Examples

**Purpose**: User-facing documentation and example usage

- [ ] T059 [P] Create example HTML file in docs/example-runtime.html demonstrating runtime registration
- [ ] T060 [P] Create example config file in docs/example-config.json demonstrating build-time approach
- [ ] T061 [P] Create example with TailwindCSS integration in docs/example-tailwind.html
- [ ] T062 [P] Update README.md with complete API documentation for NovaIcon methods
- [ ] T063 [P] Update README.md with CLI usage examples and flags
- [ ] T064 [P] Update README.md with JSR.io publishing instructions for maintainers

**Independent Test**: Follow quickstart.md examples, verify all work as documented

**Checkpoint**: Documentation complete and validated

---

## Phase 8: JSR.io Publication Preparation

**Purpose**: Final validation before publishing to JSR.io

- [ ] T065 Verify jsr.json exports map correctly to src/ TypeScript files
- [ ] T066 Verify package.json includes src/ in files whitelist for JSR publication
- [ ] T067 Run all tests with `bun test` and ensure 100% pass
- [ ] T068 Test local installation with `npx jsr add @orb-zone/nova-icon` (dry run)
- [ ] T069 Validate README displays correctly on JSR.io preview
- [ ] T070 Create git tag for v0.1.0 release
- [ ] T071 Publish to JSR.io with `jsr publish` command

**Independent Test**: Install published package from JSR.io, verify all features work

**Checkpoint**: Package published and installable from JSR.io

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundation)**: No dependencies - can start immediately
- **Phase 2 (Schema)**: Depends on Phase 1 (T001-T006) for tsconfig and package.json
- **Phase 3 (Registry)**: Depends on Phase 2 (T010) for TypeScript types
- **Phase 4 (Component)**: Depends on Phase 3 (T017-T021) for registry API
- **Phase 5 (CLI)**: Depends on Phase 2 (T010-T011) for schema validation, can run parallel to Phase 3-4
- **Phase 6 (Build)**: Depends on Phase 4 (T027-T034) and Phase 5 (T042-T051) for source files
- **Phase 7 (Docs)**: Depends on Phase 4 (T027-T034) for working component
- **Phase 8 (Publish)**: Depends on all previous phases

### Critical Path

```
Phase 1 (Foundation)
  ↓
Phase 2 (Schema & Types) [T010 critical for types]
  ↓
Phase 3 (Registry API) ← provides API for Phase 4
  ↓
Phase 4 (Web Component)
  ↓
Phase 6 (Build System)
  ↓
Phase 7 (Documentation)
  ↓
Phase 8 (Publication)
```

### Parallel Opportunities

**Within Phase 1 (Foundation)**:
- T003 (tsconfig), T004 (dependencies), T005 (scripts), T006 (README) - all independent

**Within Phase 2 (Schema)**:
- T007, T008, T009 (all tests) - write in parallel after T010 types exist
- T010, T011 - T010 types first, then T011 validator

**Within Phase 3 (Registry)**:
- T012-T016 (all tests) - write in parallel
- T018-T021 (implementation) - after T017 base class, some methods independent

**Within Phase 4 (Component)**:
- T022-T026 (all tests) - write in parallel
- T028-T033 (methods) - some can be parallel within same file

**Within Phase 5 (CLI)**:
- T035-T041 (all tests) - write in parallel
- T043-T050 (implementation) - some can be parallel after T042 entry point

**Between Phases**:
- Phase 5 (CLI) can run fully parallel to Phase 3-4 after Phase 2 types are ready
- Phase 7 (Docs) tasks T059-T064 are all independent

---

## Parallel Execution Examples

### Phase 2 Tests (After T010 types exist):
```bash
Task: "Contract test for JSON Schema validation in tests/contract/config-schema.test.ts"
Task: "Unit test for schema validation (valid configs) in tests/unit/schema-validation.test.ts"
Task: "Unit test for schema validation (invalid configs) in tests/unit/schema-validation-errors.test.ts"
```

### Phase 3 Tests (Write first, fail):
```bash
Task: "Contract test for NovaIcon.register() API in tests/contract/api-contract.test.ts"
Task: "Integration test for singleton defs container creation in tests/integration/runtime.test.ts"
Task: "Unit test for registry operations (register, get, has) in tests/unit/registry.test.ts"
Task: "Unit test for duplicate icon handling in tests/unit/registry-duplicates.test.ts"
Task: "Unit test for batch registration in tests/unit/registry-batch.test.ts"
```

### Phase 7 Documentation (All parallel):
```bash
Task: "Create example HTML file in docs/example-runtime.html demonstrating runtime registration"
Task: "Create example config file in docs/example-config.json demonstrating build-time approach"
Task: "Create example with TailwindCSS integration in docs/example-tailwind.html"
Task: "Update README.md with complete API documentation for NovaIcon methods"
Task: "Update README.md with CLI usage examples and flags"
```

---

## Implementation Strategy

### TDD Workflow (Constitution Requirement)

For each phase:
1. Write ALL tests first (marked with T0XX test tasks)
2. Run tests - verify they FAIL
3. Implement feature (marked with T0XX implementation tasks)
4. Run tests - verify they PASS
5. Refactor if needed
6. Move to next phase

### MVP Scope (Minimal Viable Package)

To publish a working package, complete:
- Phase 1: Foundation ✓
- Phase 2: Schema & Validation ✓
- Phase 3: Registry API ✓
- Phase 4: Web Component ✓
- Phase 6: Build System ✓
- Phase 8: Publication ✓

**Skip for MVP**: Phase 5 (CLI Tool), Phase 7 (Advanced Docs)

### Full Feature Scope

Complete all 8 phases for feature parity with spec:
- MVP phases above
- Phase 5: CLI tool for build-time SVG processing
- Phase 7: Comprehensive examples and documentation

---

## Constitution Compliance Checklist

- ✅ **Test-First**: All implementation phases have tests written first
- ✅ **CLI Interface**: Phase 5 implements stdin/stdout CLI per constitution
- ✅ **Library-First**: Package is standalone, self-contained
- ✅ **Integration Testing**: Phase 2-5 include contract tests
- ✅ **Simplicity**: Single registry pattern, ESM-only, standard tools

---

## Notes

- [P] tasks = different files or independent work, can parallelize
- Test tasks MUST be written and FAIL before implementation tasks
- Constitution requires TDD: Red (test fails) → Green (test passes) → Refactor
- Commit after each task or logical group
- JSR.io publishing requires TypeScript source files in package
- Build outputs to dist/ but src/ must also be published
- Avoid: skipping tests, implementing before tests written, npm instead of JSR.io
