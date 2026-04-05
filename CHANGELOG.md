# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-04-05

### Added

- **Harness Engineering**: Generator-Evaluator separation in Step 5 (independent ID cross-check)
- **reqdes v1.2.0 integration**: workflow_config.md mode detection (Full/Light/Enhance)
- **Trust Design**: Trust Requirements section in spec.md (Tier 1 P1-P7, Tier 2 P8-P13)
- **Trust Design**: Trust Design Principles section in constitution.md
- **Enforcement Ladder**: L1-L4 escalation in constitution.md template
- **Screen Inventory**: SC-XXX mapping from reqdes screen list to spec.md
- **Sprint Contracts**: Testable success criteria per sprint in spec.md
- **Session Resume**: bridge-progress.json for cross-session step tracking (Step 0.5)
- **Anchor link preservation**: linkify-ids v1.2.0 format compatibility
- **Light mode**: 60pt quality gate (42/60 threshold) support
- **Enhance mode**: Delta requirements processing support
- New test files: integration.spec.ts, harness.spec.ts, trust-design.spec.ts (+35 tests)
- examples/before/workflow_config.md (reqdes v1.2.0 output)

### Changed

- Step 0: Mode detection from workflow_config.md, multi-format quality score (XX/100, XX/60)
- Step 2: constitution.md template expanded with Trust Design + Enforcement Ladder
- Step 4: spec.md expanded with Trust Requirements, Screen Inventory, Sprint Contracts
- Step 5: Renamed to "Quality Validation (Evaluator)" with Generator-Evaluator separation
- Workflow: 10 steps → 12 steps (added Step 0.5 Progress Check)
- Mapping reference: 15 → 19 entries (workflow_config, trust, screen inventory, sprint)
- examples/after/spec.md: Added Trust Requirements, Screen Inventory, Sprint Contracts
- examples/after/constitution.md: Added Trust Design Principles, Enforcement Ladder

## [1.1.0] - 2026-03-28

### Added

- ESLint with TypeScript support and Prettier integration
- CI workflow: lint step and npm audit security check
- SECURITY.md vulnerability reporting policy
- CHANGELOG.md (this file)
- Test split: 1 monolithic file (38 tests) → 3 focused files (62 tests)
  - `structure.spec.ts` — file existence, frontmatter, package/config validation
  - `content.spec.ts` — workflow steps, prerequisites, output files, mapping, error handling
  - `scenarios.spec.ts` — examples, conversion pairs, Five-File Sync, infrastructure
- Shared test helpers in `tests/helpers.ts`

### Changed

- `package.json` quality script now includes lint step
- CI workflow runs lint before tests

### Removed

- Empty `templates/` directory
- Monolithic `tests/skill-structure.spec.ts` (replaced by 3 focused files)

## [1.0.0] - 2026-03-28

### Added

- Initial release of speckit-bridge skill
- 10-step conversion workflow (designs/ → spec-kit format)
- Multi-layered anti-drift defense (conventions.md + ESLint + Husky)
- Before/after examples (TaskFlow project)
- 38 Playwright regression tests
- README.md (Japanese) and README.en.md (English)
- CONTRIBUTING.md with Five-File Sync Rule
- CI/CD with GitHub Actions (typecheck, format, test)
