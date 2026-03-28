# Changelog

All notable changes to this project will be documented in this file.

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
