import { test, expect } from "@playwright/test";
import { join } from "path";
import { ROOT, readFile, fileExists } from "./helpers";

const SKILL_PATH = join(ROOT, "SKILL.md");

// ---------------------------------------------------------------------------
// 1. File Existence
// ---------------------------------------------------------------------------
test.describe("File existence", () => {
  const requiredFiles = [
    "SKILL.md",
    "README.md",
    "README.en.md",
    "package.json",
    "tsconfig.json",
    "playwright.config.ts",
    ".gitignore",
    ".prettierrc",
  ];

  for (const file of requiredFiles) {
    test(`${file} exists`, () => {
      expect(fileExists(join(ROOT, file))).toBe(true);
    });
  }

  test("tests/ directory exists", () => {
    expect(fileExists(join(ROOT, "tests"))).toBe(true);
  });

  test("examples/before/ directory exists", () => {
    expect(fileExists(join(ROOT, "examples", "before"))).toBe(true);
  });

  test("examples/after/ directory exists", () => {
    expect(fileExists(join(ROOT, "examples", "after"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. SKILL.md Frontmatter
// ---------------------------------------------------------------------------
test.describe("SKILL.md frontmatter", () => {
  const skill = readFile(SKILL_PATH);

  test("has YAML frontmatter delimiters", () => {
    expect(skill.startsWith("---\n")).toBe(true);
    const secondDelimiter = skill.indexOf("---", 4);
    expect(secondDelimiter).toBeGreaterThan(4);
  });

  test("name is speckit-bridge", () => {
    expect(skill).toMatch(/^name:\s*speckit-bridge$/m);
  });

  test("type is automation", () => {
    expect(skill).toMatch(/^type:\s*automation$/m);
  });

  test("has description field", () => {
    expect(skill).toMatch(/^description:/m);
  });

  test("has best_for field", () => {
    expect(skill).toMatch(/^best_for:/m);
  });

  test("has triggers field with at least 3 entries", () => {
    expect(skill).toMatch(/^triggers:/m);
    const triggerMatches = skill.match(/^\s+-\s+"[^"]+"/gm);
    expect(triggerMatches).not.toBeNull();
    expect(triggerMatches!.length).toBeGreaterThanOrEqual(3);
  });
});

// ---------------------------------------------------------------------------
// 3. Package & Config Validation
// ---------------------------------------------------------------------------
test.describe("Package and config validation", () => {
  test("package.json has required scripts", () => {
    const pkg = JSON.parse(readFile(join(ROOT, "package.json")));
    expect(pkg.scripts).toHaveProperty("test");
    expect(pkg.scripts).toHaveProperty("typecheck");
    expect(pkg.scripts).toHaveProperty("format:check");
    expect(pkg.scripts).toHaveProperty("quality");
  });

  test("package.json has lint script", () => {
    const pkg = JSON.parse(readFile(join(ROOT, "package.json")));
    expect(pkg.scripts).toHaveProperty("lint");
  });

  test(".prettierrc is valid JSON", () => {
    const content = readFile(join(ROOT, ".prettierrc"));
    expect(() => JSON.parse(content)).not.toThrow();
  });

  test("tsconfig.json has strict mode enabled", () => {
    const tsconfig = JSON.parse(readFile(join(ROOT, "tsconfig.json")));
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  test("tsconfig.json includes tests", () => {
    const tsconfig = JSON.parse(readFile(join(ROOT, "tsconfig.json")));
    const includesTests = tsconfig.include.some((p: string) => p.includes("tests"));
    expect(includesTests).toBe(true);
  });
});
