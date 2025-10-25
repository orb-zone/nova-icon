# Tasks: Lineart Animations

**Input**: Design documents from `/specs/003-lineart-animations/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included per Test-First principle in constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Update dependencies for animation support in package.json
- [ ] T002 [P] Configure CSS custom properties for animations in src/nova-icon.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Add base animation attributes to NovaIcon component in src/nova-icon.ts
- [ ] T004 [P] Implement path normalization (pathLength="1") in src/nova-icon.ts
- [ ] T005 [P] Add inline transition styles for paths in src/nova-icon.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Hover Animation (Priority: P1) 🎯 MVP

**Goal**: Enable stroke-dash animations on hover with default timing

**Independent Test**: Set animation="hover" on NovaIcon and verify paths animate on hover

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T006 [P] [US1] Unit test for hover animation trigger in tests/unit/component-attributes.test.ts
- [ ] T007 [P] [US1] Integration test for path animation in tests/integration/component-animation.test.ts

### Implementation for User Story 1

- [ ] T008 [P] [US1] Implement hover event listener in src/nova-icon.ts
- [ ] T009 [US1] Add stroke-dasharray and stroke-dashoffset logic in src/nova-icon.ts
- [ ] T010 [US1] Implement prefers-reduced-motion check in src/nova-icon.ts
- [ ] T011 [US1] Add default duration and delay handling in src/nova-icon.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Custom Timing and Stagger Effects (Priority: P2)

**Goal**: Fine-tune animation timing with duration, delay, stagger

**Independent Test**: Set stagger="0.1s" and verify sequential path animation

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T012 [P] [US2] Unit test for stagger calculation in tests/unit/component-attributes.test.ts
- [ ] T013 [P] [US2] Integration test for custom timing in tests/integration/component-animation.test.ts

### Implementation for User Story 2

- [ ] T014 [P] [US2] Parse duration attribute in src/nova-icon.ts
- [ ] T015 [P] [US2] Parse delay attribute in src/nova-icon.ts
- [ ] T016 [US2] Implement stagger logic with --path-index in src/nova-icon.ts
- [ ] T017 [US2] Update transition delays for stagger in src/nova-icon.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Multi-Layer Animation Composition (Priority: P3)

**Goal**: Complex layered animations with independent timing

**Independent Test**: Set layers="bg:2s,pg:1s:0.5s,fg:0.5s:1s" and verify each layer animates independently

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T018 [P] [US3] Unit test for layers parsing in tests/unit/component-attributes.test.ts
- [ ] T019 [P] [US3] Integration test for multi-layer animation in tests/integration/component-animation.test.ts

### Implementation for User Story 3

- [ ] T020 [P] [US3] Parse layers attribute in src/nova-icon.ts
- [ ] T021 [US3] Implement layer grouping for paths in src/nova-icon.ts
- [ ] T022 [US3] Apply different stroke weights and opacities per layer in src/nova-icon.ts
- [ ] T023 [US3] Handle layer timing independently in src/nova-icon.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T024 [P] Update documentation in README.md
- [ ] T025 Code cleanup and refactoring in src/nova-icon.ts
- [ ] T026 [P] Performance optimization for 60 FPS in src/nova-icon.ts
- [ ] T027 [P] Additional unit tests in tests/unit/
- [ ] T028 Security hardening (none needed for client-side)
- [ ] T029 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Unit test for hover animation trigger in tests/unit/component-attributes.test.ts"
Task: "Integration test for path animation in tests/integration/component-animation.test.ts"

# Launch all models for User Story 1 together:
Task: "Implement hover event listener in src/nova-icon.ts"
Task: "Add stroke-dasharray and stroke-dashoffset logic in src/nova-icon.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence