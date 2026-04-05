import { test, expect } from "@playwright/test";
import { join } from "path";
import { ROOT, readFile } from "./helpers";

const SKILL_PATH = join(ROOT, "SKILL.md");
const skill = readFile(SKILL_PATH);

// ---------------------------------------------------------------------------
// 1. Trust Design Integration (reqdes v1.2.0 Tier 1/2)
// ---------------------------------------------------------------------------
test.describe("Trust design integration", () => {
  test("SKILL.md mentions Trust Design or trust requirements", () => {
    expect(skill).toMatch(/Trust Design|trust.*requirement|信頼設計/i);
  });

  test("SKILL.md handles Tier 1 trust patterns (P1-P7)", () => {
    expect(skill).toMatch(/Tier\s*1|P1.*P7|7.*パターン/i);
  });

  test("SKILL.md handles Tier 2 trust patterns for AI features", () => {
    expect(skill).toMatch(/Tier\s*2|AI.*trust|AI.*信頼/i);
  });
});

// ---------------------------------------------------------------------------
// 2. Trust FR/US → spec.md Mapping
// ---------------------------------------------------------------------------
test.describe("Trust FR/US mapping to spec.md", () => {
  test("SKILL.md maps trust FRs to a dedicated section", () => {
    expect(skill).toMatch(/Trust Requirements|信頼要件/i);
  });

  test("SKILL.md preserves trust US acceptance criteria", () => {
    expect(skill).toMatch(/trust.*scenario|信頼.*シナリオ|trust.*acceptance/i);
  });
});

// ---------------------------------------------------------------------------
// 3. Constitution Trust Design Section
// ---------------------------------------------------------------------------
test.describe("Constitution trust design section", () => {
  test("SKILL.md adds Trust Design Principles to constitution.md", () => {
    expect(skill).toMatch(/Trust Design Principles/i);
  });

  test("examples/after/constitution.md includes trust design section", () => {
    const constitution = readFile(join(ROOT, "examples", "after", "constitution.md"));
    expect(constitution).toMatch(/Trust Design|trust/i);
  });
});

// ---------------------------------------------------------------------------
// 4. Quality Score Trust Adjustment
// ---------------------------------------------------------------------------
test.describe("Quality score trust adjustment", () => {
  test("SKILL.md mentions trust-based quality score adjustment", () => {
    expect(skill).toMatch(/信頼.*調整|trust.*adjust|±\s*\d+/i);
  });
});
