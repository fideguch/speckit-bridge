# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in speckit-bridge, please report it responsibly.

**Contact**: Open a GitHub issue with the label `security` or email the repository owner directly.

**Response time**: We aim to acknowledge reports within 48 hours and provide a fix within 7 days for critical issues.

## Scope

speckit-bridge is a code generation skill that converts requirements documents into spec-kit format. It does not handle user authentication, network requests, or sensitive data at runtime.

### Security Considerations for Generated Files

The skill generates the following files in target repositories:

- `spec.md` — Feature specification (may contain business-sensitive requirements)
- `constitution.md` — Project principles and architecture governance
- `conventions.md` — Coding conventions and naming rules

**Recommendations for users:**

1. **Review generated files** before committing — ensure no sensitive business logic is exposed in public repositories
2. **Do not include secrets** in `designs/` input files — the skill does not filter or redact secrets from source documents
3. **Validate generated ESLint configs** — the enforcement scaffold (`Step 2.6`) generates ESLint rules; review them before applying to production code

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | Yes       |

## Dependencies

This project uses minimal dependencies (Playwright for testing, Prettier for formatting, TypeScript for type checking). We monitor for known vulnerabilities via `npm audit` in CI.
