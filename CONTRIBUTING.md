# Contributing to speckit-bridge

## Development Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run all quality checks (typecheck + format + test)
npm run quality
```

## Five-File Sync Rule

When modifying the skill definition, always keep these files in sync:

1. **SKILL.md** -- Skill definition and workflow steps
2. **README.md** -- Japanese user-facing documentation
3. **README.en.md** -- English user-facing documentation
4. **tests/\*.spec.ts** -- Regression tests (structure, content, scenarios)
5. **examples/** -- Before/after conversion examples

## Test Guidelines

- Tests use Playwright Test runner (not browser automation, just the test framework)
- Tests validate SKILL.md structure, frontmatter, workflow steps, and example files
- Run `npm test` before committing to ensure no regressions
- Add new tests when adding new workflow steps or output files

## Commit Messages

Use Conventional Commits format:

```
feat: add new workflow step for X
fix: correct mapping for NFR conversion
test: add regression test for conventions.md line limit
docs: update README with new trigger words
```

## Pull Request Process

1. Ensure all tests pass: `npm run quality`
2. Update examples if the conversion logic changes
3. Keep conventions.md examples under 50 lines
4. Update both README.md and README.en.md
