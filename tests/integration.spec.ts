import { test, expect } from "@playwright/test";
import { join } from "path";
import { ROOT, readFile } from "./helpers";

const SKILL_PATH = join(ROOT, "SKILL.md");
const skill = readFile(SKILL_PATH);

// ---------------------------------------------------------------------------
// 1. workflow_config.md Support (reqdes v1.2.0)
// ---------------------------------------------------------------------------
test.describe("workflow_config.md support", () => {
  test("SKILL.md mentions workflow_config.md as input", () => {
    expect(skill).toContain("workflow_config.md");
  });

  test("SKILL.md handles Full mode (100pt quality gate)", () => {
    expect(skill).toMatch(/Full.*100/s);
  });

  test("SKILL.md handles Light mode (60pt quality gate)", () => {
    expect(skill).toMatch(/Light.*60/s);
  });

  test("SKILL.md handles Enhance mode (delta requirements)", () => {
    expect(skill).toMatch(/Enhance/);
    expect(skill).toMatch(/delta|デルタ/i);
  });
});

// ---------------------------------------------------------------------------
// 2. Anchor Link Format (linkify-ids v1.2.0)
// ---------------------------------------------------------------------------
test.describe("Anchor link format compatibility", () => {
  test("SKILL.md mentions anchor link preservation", () => {
    expect(skill).toMatch(/anchor|アンカー/i);
  });

  test("SKILL.md references linkify-ids format", () => {
    // Should handle [FR-001](./functional_requirements.md#fr-001) format
    expect(skill).toMatch(/\[FR-\d+\]\(\.\/functional_requirements\.md#fr-\d+\)|linkify/i);
  });
});

// ---------------------------------------------------------------------------
// 3. Quality Gate Multi-Format
// ---------------------------------------------------------------------------
test.describe("Quality gate multi-format support", () => {
  test("SKILL.md supports 100pt format (Full mode)", () => {
    expect(skill).toMatch(/100/);
    expect(skill).toMatch(/70/); // 70/100 threshold
  });

  test("SKILL.md supports 60pt format (Light mode)", () => {
    expect(skill).toMatch(/60/);
    expect(skill).toMatch(/42/); // 42/60 threshold
  });

  test("SKILL.md documents quality score format detection", () => {
    // Should detect XX/100 or XX/60 format
    expect(skill).toMatch(/\/100|\/60/);
  });
});

// ---------------------------------------------------------------------------
// 4. Screen Inventory Mapping (SC-XXX)
// ---------------------------------------------------------------------------
test.describe("Screen inventory mapping", () => {
  test("SKILL.md maps SC-XXX to spec.md", () => {
    expect(skill).toContain("SC-");
    expect(skill).toMatch(/Screen Inventory|Screen Reference|画面イン��ントリ/i);
  });
});

// ---------------------------------------------------------------------------
// 5. Generator-Evaluator Separation
// ---------------------------------------------------------------------------
test.describe("Generator-Evaluator pattern", () => {
  test("SKILL.md describes evaluator as independent verification", () => {
    expect(skill).toMatch(/[Ee]valuator|独立.*検証|independent.*verif/i);
  });

  test("SKILL.md specifies FR/US ID cross-check with designs/", () => {
    expect(skill).toMatch(/突合|cross.?check|traceability.*verif/i);
  });
});

// ---------------------------------------------------------------------------
// 6. examples/before/ has workflow_config.md
// ---------------------------------------------------------------------------
test.describe("examples/ reqdes v1.2.0 compatibility", () => {
  test("examples/before/ includes workflow_config.md", () => {
    const content = readFile(join(ROOT, "examples", "before", "workflow_config.md"));
    expect(content).toMatch(/mode|Mode/i);
  });

  test("examples/after/spec.md has Trust Requirements section", () => {
    const spec = readFile(join(ROOT, "examples", "after", "spec.md"));
    expect(spec).toMatch(/Trust Requirements|Trust Design/i);
  });

  test("examples/after/spec.md has Screen Inventory section", () => {
    const spec = readFile(join(ROOT, "examples", "after", "spec.md"));
    expect(spec).toMatch(/Screen Inventory/i);
  });

  test("examples/after/constitution.md has Enforcement Ladder", () => {
    const constitution = readFile(join(ROOT, "examples", "after", "constitution.md"));
    expect(constitution).toMatch(/Enforcement Ladder/i);
  });
});
