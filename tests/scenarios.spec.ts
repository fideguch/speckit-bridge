import { test, expect } from "@playwright/test";
import { join } from "path";
import { ROOT, readFile, fileExists, listDir } from "./helpers";

// ---------------------------------------------------------------------------
// 1. examples/before/ content
// ---------------------------------------------------------------------------
test.describe("examples/before/ content", () => {
  const beforeDir = join(ROOT, "examples", "before");

  test("README.md exists and has project charter structure", () => {
    const content = readFile(join(beforeDir, "README.md"));
    expect(content).toContain("TaskFlow");
    expect(content).toMatch(/背景|目的|Background|Purpose/i);
  });

  test("functional_requirements.md exists and has FR-001", () => {
    const content = readFile(join(beforeDir, "functional_requirements.md"));
    expect(content).toContain("FR-001");
  });

  test("user_stories.md exists and has US-001", () => {
    const content = readFile(join(beforeDir, "user_stories.md"));
    expect(content).toContain("US-001");
  });
});

// ---------------------------------------------------------------------------
// 2. examples/after/ content
// ---------------------------------------------------------------------------
test.describe("examples/after/ content", () => {
  const afterDir = join(ROOT, "examples", "after");

  test("spec.md exists and has Functional Requirements section", () => {
    const content = readFile(join(afterDir, "spec.md"));
    expect(content).toContain("Functional Requirements");
    expect(content).toContain("FR-001");
  });

  test("constitution.md exists and has Core Principles section", () => {
    const content = readFile(join(afterDir, "constitution.md"));
    expect(content).toContain("Core Principles");
  });

  test("conventions.md exists and is under 50 lines", () => {
    const content = readFile(join(afterDir, "conventions.md"));
    const lineCount = content.split("\n").length;
    expect(lineCount).toBeLessThanOrEqual(50);
  });

  test("conventions.md has 5 required sections", () => {
    const content = readFile(join(afterDir, "conventions.md"));
    expect(content).toContain("Directory Structure");
    expect(content).toContain("Database");
    expect(content).toContain("API");
    expect(content).toContain("Business Rules");
    expect(content).toContain("Design Tokens");
  });
});

// ---------------------------------------------------------------------------
// 3. Before/After Conversion Pair Consistency
// ---------------------------------------------------------------------------
test.describe("Before/after conversion pair consistency", () => {
  test("before/ has input files that after/ transforms", () => {
    const beforeFiles = listDir(join(ROOT, "examples", "before"));
    const afterFiles = listDir(join(ROOT, "examples", "after"));
    // before/ should have source files, after/ should have transformed outputs
    expect(beforeFiles.length).toBeGreaterThan(0);
    expect(afterFiles.length).toBeGreaterThan(0);
  });

  test("after/spec.md references FR IDs from before/functional_requirements.md", () => {
    const fr = readFile(join(ROOT, "examples", "before", "functional_requirements.md"));
    const spec = readFile(join(ROOT, "examples", "after", "spec.md"));
    // Extract FR-XXX IDs from before
    const frIds = fr.match(/FR-\d+/g) ?? [];
    expect(frIds.length).toBeGreaterThan(0);
    // At least the first FR ID should appear in spec.md
    expect(spec).toContain(frIds[0]);
  });

  test("after/conventions.md mentions directory structure from spec context", () => {
    const conventions = readFile(join(ROOT, "examples", "after", "conventions.md"));
    expect(conventions).toMatch(/src\/|app\/|directory/i);
  });
});

// ---------------------------------------------------------------------------
// 4. Five-File Sync Rule Verification
// ---------------------------------------------------------------------------
test.describe("Five-File Sync Rule", () => {
  test("CONTRIBUTING.md exists and mentions sync rule", () => {
    const content = readFile(join(ROOT, "CONTRIBUTING.md"));
    expect(content).toMatch(/sync/i);
  });

  test("CONTRIBUTING.md references SKILL.md", () => {
    const content = readFile(join(ROOT, "CONTRIBUTING.md"));
    expect(content).toContain("SKILL.md");
  });

  test("CONTRIBUTING.md references README.md", () => {
    const content = readFile(join(ROOT, "CONTRIBUTING.md"));
    expect(content).toContain("README.md");
  });

  test("CONTRIBUTING.md references tests", () => {
    const content = readFile(join(ROOT, "CONTRIBUTING.md"));
    expect(content).toMatch(/tests?\//);
  });
});

// ---------------------------------------------------------------------------
// 5. Project Infrastructure
// ---------------------------------------------------------------------------
test.describe("Project infrastructure", () => {
  test("SECURITY.md exists", () => {
    expect(fileExists(join(ROOT, "SECURITY.md"))).toBe(true);
  });

  test("CHANGELOG.md exists", () => {
    expect(fileExists(join(ROOT, "CHANGELOG.md"))).toBe(true);
  });

  test("CHANGELOG.md has version entries", () => {
    const content = readFile(join(ROOT, "CHANGELOG.md"));
    expect(content).toMatch(/##\s+\[?\d+\.\d+/);
  });

  test("README.en.md exists and is non-empty", () => {
    const content = readFile(join(ROOT, "README.en.md"));
    expect(content.length).toBeGreaterThan(100);
  });

  test(".github/workflows/ci.yml exists", () => {
    expect(fileExists(join(ROOT, ".github", "workflows", "ci.yml"))).toBe(true);
  });

  test("CI workflow includes lint step", () => {
    const ci = readFile(join(ROOT, ".github", "workflows", "ci.yml"));
    expect(ci).toContain("lint");
  });

  test("CI workflow includes audit step", () => {
    const ci = readFile(join(ROOT, ".github", "workflows", "ci.yml"));
    expect(ci).toContain("audit");
  });

  test("no empty templates/ directory", () => {
    // templates/ should not exist as an empty directory
    if (fileExists(join(ROOT, "templates"))) {
      const files = listDir(join(ROOT, "templates"));
      expect(files.length).toBeGreaterThan(0);
    }
  });
});
