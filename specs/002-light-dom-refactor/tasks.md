# Tasks: Light DOM Refactor

**Input**: Design documents from `/specs/002-light-dom-refactor/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-api.md

**Feature**: Refactor NovaIcon web component from shadow DOM to light DOM rendering to enable Tailwind CSS integration and efficient symbol sharing via SVG `<use>` elements.

**Tests**: Test tasks included per constitution Test-First principle. Tests will be updated first (Red), then implementation follows (Green), then refactor.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Repository uses single project structure:
- `src/` - Source code at repository root
- `tests/` - Tests at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new infrastructure needed - this is a refactor of existing code

- [x] T001 Verify current test suite baseline by running `bun test` and confirming 30 pass, 6 skip, 0 fail

**Checkpoint**: Baseline established - ready for refactor work

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core registry enhancements that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No component refactor can begin until registry supports auto-recreation

### Registry Enhancement

- [x] T002 Add defs container existence check to NovaIconRegistry.getDefsContainer() in src/runtime/registry.ts
- [x] T003 Implement auto-recreation logic when defs container removed from DOM in src/runtime/registry.ts
- [x] T004 Add unit test for defs container auto-recreation in tests/unit/registry.test.ts

**Checkpoint**: Registry foundation ready - component refactor can now begin

---

## Phase 3: User Story 1 - Icon Rendering with Tailwind Classes (Priority: P1) 🎯 MVP

**Goal**: Enable Tailwind CSS utility classes to work directly on NovaIcon components by rendering to light DOM

**Independent Test**: Apply Tailwind classes like `text-red-500 w-8 h-8` to a NovaIcon component and verify they affect the rendered SVG styling

### Tests for User Story 1 (Update First - TDD Red Phase)

> **NOTE: Update these tests FIRST to expect light DOM, ensure they FAIL before implementation**

- [x] T005 [P] [US1] Update tests/unit/component-attributes.test.ts to query light DOM instead of shadowRoot
- [x] T006 [P] [US1] Update tests/unit/component-accessibility.test.ts to query light DOM instead of shadowRoot  
- [x] T007 [P] [US1] Update tests/integration/component-rendering.test.ts to query light DOM and expect `<use>` elements
- [x] T008 [P] [US1] Add test for Tailwind class application in tests/integration/component-rendering.test.ts
- [x] T009 [P] [US1] Add test for CSS custom property inheritance in tests/unit/component.test.ts

**Checkpoint Tests Updated**: Run `bun test` - should see failures where tests expect light DOM but component still uses shadow DOM

### Implementation for User Story 1 (TDD Green Phase)

- [x] T010 [US1] Remove `attachShadow()` call and `_shadowRoot` field from src/nova-icon.ts constructor
- [x] T011 [US1] Remove inline `<style>` element creation from src/nova-icon.ts constructor
- [x] T012 [US1] Update render() method to clear innerHTML instead of shadowRoot children in src/nova-icon.ts
- [x] T013 [US1] Update render() method to create SVG with `<use href="#icon-name">` element in src/nova-icon.ts
- [x] T014 [US1] Update render() method to appendChild(svg) instead of shadowRoot.appendChild in src/nova-icon.ts
- [x] T015 [US1] Move CSS variable setting from inline style to host element style property in src/nova-icon.ts
- [x] T016 [US1] Implement placeholder icon rendering (outlined square + "?") in src/nova-icon.ts
- [x] T017 [US1] Add console.warn() for missing icons in src/nova-icon.ts
- [x] T018 [US1] Update disconnectedCallback() to remove light DOM cleanup in src/nova-icon.ts

**Checkpoint Implementation Complete**: Run `bun test` - all previously failing tests should now pass

### Refactor for User Story 1 (TDD Refactor Phase)

- [x] T019 [US1] Extract placeholder SVG generation to private method in src/nova-icon.ts
- [x] T020 [US1] Simplify render() method logic and improve readability in src/nova-icon.ts

**Checkpoint US1 Complete**: Run `bun test` - verify 0 skipped tests, all tests pass, Tailwind classes work

---

## Phase 4: User Story 2 - Efficient Symbol Sharing via `<use>` (Priority: P2)

**Goal**: Ensure icon path data appears only once in shared `<defs>` container with N `<use>` references for efficiency

**Independent Test**: Register one icon, render it 100 times, verify path data appears once in `<defs>` and 100 `<use href="#icon-name">` references exist

### Tests for User Story 2

- [ ] T021 [P] [US2] Add test verifying single symbol definition for multiple instances in tests/integration/component-rendering.test.ts
- [ ] T022 [P] [US2] Add test for 100 instances sharing one symbol in tests/integration/component-rendering.test.ts
- [ ] T023 [P] [US2] Add test for `<use>` element href attribute correctness in tests/unit/component.test.ts

**Checkpoint Tests Written**: Tests should pass if US1 implementation already uses `<use>` pattern

### Implementation for User Story 2

- [ ] T024 [US2] Verify NovaIcon render() creates `<use>` elements (should be complete from US1)
- [ ] T025 [US2] Verify NovaIconRegistry.register() creates symbols in shared defs (already exists from 001)
- [ ] T026 [US2] Add performance test measuring symbol sharing efficiency in tests/integration/component-rendering.test.ts

**Checkpoint US2 Complete**: Run `bun test` and verify symbol sharing with DevTools inspection

---

## Phase 5: User Story 3 - Re-enable Skipped Component Tests (Priority: P3)

**Goal**: All 6 previously skipped component tests now pass with light DOM implementation

**Independent Test**: Run `bun test` and verify 0 skipped tests, all tests pass

### Tests for User Story 3

- [ ] T027 [US3] Remove `.skip()` from tests/unit/component-attributes.test.ts (3 tests)
- [ ] T028 [US3] Remove `.skip()` from tests/unit/component-accessibility.test.ts (2 tests)
- [ ] T029 [US3] Remove `.skip()` from tests/integration/component-rendering.test.ts (1 test)
- [ ] T030 [US3] Verify all edge case tests pass: missing icon, defs removed, innerHTML cleared in tests/unit/component.test.ts

### Implementation for User Story 3 (Validation Only)

- [ ] T031 [US3] Run full test suite with `bun test` and verify 0 skipped, all pass
- [ ] T032 [US3] Verify test output shows increased test count (36 → 42 tests passing)

**Checkpoint US3 Complete**: Test suite shows 0 skipped, 42+ tests passing

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and final cleanup

### Documentation

- [ ] T033 [P] Update AGENTS.md if needed (already updated by Phase 1 design)
- [ ] T034 [P] Create example HTML file demonstrating Tailwind integration in concept-example-tailwind.html
- [ ] T035 [P] Update README.md with light DOM notes (if applicable)

### Validation

- [ ] T036 Run quickstart.md validation: Verify all examples work with light DOM
- [ ] T037 Manual DevTools verification: Inspect 100 icon instances, confirm 1 symbol + 100 uses
- [ ] T038 Verify Tailwind classes work: Apply `w-8 h-8 text-blue-500` to component and inspect styles
- [ ] T039 Verify CSS variable inheritance: Set `--line-color` on parent, verify icon inherits it
- [ ] T040 Verify prefers-reduced-motion still respected: Toggle media query and check --animation-enabled

### Performance Validation

- [ ] T041 Run performance profiling: Measure render time for 100 icons (<50ms total target)
- [ ] T042 Verify memory efficiency: Compare shadow DOM version vs light DOM version memory usage

### Final Checks

- [ ] T043 Run `bun test` one final time - confirm all tests pass, 0 skipped
- [ ] T044 Run `bun run build` - verify build succeeds with no errors
- [ ] T045 Verify no breaking changes: API contract tests still pass in tests/contract/

**Checkpoint Polish Complete**: Feature ready for PR and merge

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - Core refactor, blocks US2/US3
- **User Story 2 (Phase 4)**: Depends on US1 - Validates efficiency (may already be satisfied by US1)
- **User Story 3 (Phase 5)**: Depends on US1 - Test validation phase
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: BLOCKS US2 and US3 - Core light DOM implementation required first
- **User Story 2 (P2)**: Can start after US1 - Validates symbol sharing (likely already done)
- **User Story 3 (P3)**: Can start after US1 - Removes `.skip()` and validates all tests pass

**Note**: Unlike typical multi-story projects, this refactor has US1 as a blocking prerequisite because it fundamentally changes the rendering architecture.

### Within Each User Story

**User Story 1 (TDD Cycle)**:
1. T005-T009: Update tests to expect light DOM (Red - tests fail)
2. T010-T018: Implement light DOM rendering (Green - tests pass)
3. T019-T020: Refactor for clarity (tests still pass)

**User Story 2 (Validation)**:
1. T021-T023: Add symbol sharing tests
2. T024-T026: Verify implementation (should already work from US1)

**User Story 3 (Test Enablement)**:
1. T027-T030: Remove `.skip()` from tests
2. T031-T032: Validate all pass

### Parallel Opportunities

**Phase 2 (Foundational)**:
- T002, T003 (sequential in same file)
- T004 (parallel - different file)

**Phase 3 User Story 1 - Test Updates**:
```bash
# Can run in parallel (different files):
Task T005: tests/unit/component-attributes.test.ts
Task T006: tests/unit/component-accessibility.test.ts
Task T007: tests/integration/component-rendering.test.ts
Task T008: tests/integration/component-rendering.test.ts (same file as T007, sequential)
Task T009: tests/unit/component.test.ts
```

**Phase 3 User Story 1 - Implementation**:
- T010-T020: Sequential (all in src/nova-icon.ts)

**Phase 4 User Story 2 - Tests**:
```bash
# Can run in parallel (different sections):
Task T021: tests/integration/component-rendering.test.ts
Task T022: tests/integration/component-rendering.test.ts (same file, sequential with T021)
Task T023: tests/unit/component.test.ts
```

**Phase 5 User Story 3**:
```bash
# Can run in parallel (different files):
Task T027: tests/unit/component-attributes.test.ts
Task T028: tests/unit/component-accessibility.test.ts
Task T029: tests/integration/component-rendering.test.ts
Task T030: tests/unit/component.test.ts
```

**Phase 6 Polish - Documentation**:
```bash
# Can run in parallel (different files):
Task T033: AGENTS.md
Task T034: concept-example-tailwind.html
Task T035: README.md
```

---

## Parallel Example: User Story 1 Test Updates

```bash
# Launch test updates in parallel (different files):
Task: "Update component-attributes.test.ts to query light DOM"
Task: "Update component-accessibility.test.ts to query light DOM"
Task: "Update component-rendering.test.ts to query light DOM"
Task: "Add test for CSS custom property inheritance in component.test.ts"
```

After all parallel test updates complete, run `bun test` to verify Red phase (tests fail).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001) - Baseline established
2. Complete Phase 2: Foundational (T002-T004) - Registry enhanced
3. Complete Phase 3: User Story 1 (T005-T020) - Core light DOM refactor
4. **STOP and VALIDATE**: 
   - Run `bun test` - verify previously skipped tests now pass
   - Manually test Tailwind classes work
   - Inspect DOM: verify `<use>` elements present, no shadow root
5. **MVP COMPLETE**: Tailwind integration working, light DOM rendering functional

### Incremental Delivery

1. **Foundation** (Phases 1-2): Registry ready for light DOM
2. **US1 MVP** (Phase 3): Light DOM + Tailwind working → Validate independently
3. **US2 Addition** (Phase 4): Symbol sharing validated → Performance confirmed
4. **US3 Addition** (Phase 5): All tests enabled → Full coverage confirmed
5. **Polish** (Phase 6): Documentation and final validation → Ready for merge

### Single Developer Strategy

Sequential execution (TDD throughout):

1. T001: Baseline
2. T002-T004: Registry foundation (TDD)
3. T005-T009: Update tests for light DOM (Red)
4. T010-T018: Implement light DOM rendering (Green)
5. T019-T020: Refactor (tests still pass)
6. T021-T026: Symbol sharing validation
7. T027-T032: Enable all tests
8. T033-T045: Polish and validate

**Total Time Estimate**: 1-2 days for experienced developer with TypeScript/Web Components knowledge

---

## Notes

- **TDD Required**: Constitution Test-First principle enforced
- **No Breaking Changes**: API contracts maintained from 001-package-setup
- **Parallel Opportunities**: Test file updates can run in parallel
- **Single File Bottleneck**: Most implementation in src/nova-icon.ts (sequential)
- **Verify Each Phase**: Use checkpoints to validate before proceeding
- **Commit Strategy**: Commit after each phase or logical test/implementation pair
- **Avoid**: Implementing before tests updated (breaks TDD), skipping checkpoints

---

## Success Criteria Validation

After all tasks complete, verify:

- **SC-001**: ✅ Tailwind utility classes style NovaIcon components (T038)
- **SC-002**: ✅ Icon path data appears once per unique icon (T037)
- **SC-003**: ✅ All 6 previously skipped tests pass (T031-T032)
- **SC-004**: ✅ Test suite shows 0 skipped tests (T043)
- **SC-005**: ✅ 100 instances = 1 symbol + 100 uses (T037)
- **SC-006**: ✅ Component responds to attribute changes (existing tests)

**Final Command**: `bun test` → Expected: 42+ tests pass, 0 skip, 0 fail
