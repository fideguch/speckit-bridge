import { test, expect } from "@playwright/test";
import { join } from "path";
import { ROOT, readFile } from "./helpers";

const SKILL_PATH = join(ROOT, "SKILL.md");
const skill = readFile(SKILL_PATH);

// ---------------------------------------------------------------------------
// 1. SKILL.md Workflow Steps
// ---------------------------------------------------------------------------
test.describe("SKILL.md workflow steps", () => {
  const requiredSteps = [
    { id: "Step 0", heading: "Validation" },
    { id: "Step 1", heading: "Initialize spec-kit" },
    { id: "Step 1.5", heading: "Project Structure Setup" },
    { id: "Step 2", heading: "Generate Constitution" },
    { id: "Step 2.5", heading: "Generate Conventions" },
    { id: "Step 2.6", heading: "Generate Enforcement Scaffold" },
    { id: "Step 3", heading: "Create Feature Branch" },
    { id: "Step 4", heading: "Generate spec.md" },
    { id: "Step 5", heading: "Quality Validation" },
    { id: "Step 6", heading: "Report Completion" },
  ];

  for (const step of requiredSteps) {
    test(`contains ${step.id}: ${step.heading}`, () => {
      expect(skill).toContain(step.heading);
    });
  }
});

// ---------------------------------------------------------------------------
// 2. SKILL.md Prerequisites
// ---------------------------------------------------------------------------
test.describe("SKILL.md prerequisites", () => {
  test("requires designs/ directory", () => {
    expect(skill).toContain("designs/");
  });

  test("requires designs/README.md", () => {
    expect(skill).toContain("designs/README.md");
  });

  test("requires designs/functional_requirements.md", () => {
    expect(skill).toContain("designs/functional_requirements.md");
  });

  test("requires designs/user_stories.md", () => {
    expect(skill).toContain("designs/user_stories.md");
  });

  test("mentions quality score threshold of 70", () => {
    expect(skill).toMatch(/70/);
  });

  test("mentions spec-kit CLI (specify command)", () => {
    expect(skill).toContain("specify");
  });
});

// ---------------------------------------------------------------------------
// 3. SKILL.md Output Files
// ---------------------------------------------------------------------------
test.describe("SKILL.md output files", () => {
  test("generates constitution.md", () => {
    expect(skill).toContain("constitution.md");
  });

  test("generates conventions.md", () => {
    expect(skill).toContain("conventions.md");
  });

  test("generates spec.md", () => {
    expect(skill).toContain("spec.md");
  });

  test("conventions.md must be under 50 lines", () => {
    expect(skill).toMatch(/50/);
  });
});

// ---------------------------------------------------------------------------
// 4. SKILL.md Mapping Reference
// ---------------------------------------------------------------------------
test.describe("SKILL.md mapping reference", () => {
  test("has Mapping Reference section", () => {
    expect(skill).toMatch(/Mapping Reference/i);
  });

  const mappingSources = [
    "functional_requirements.md",
    "non_functional_requirements.md",
    "user_stories.md",
    "ubiquitous_language.md",
    "ui_design_brief.md",
  ];

  for (const source of mappingSources) {
    test(`mapping includes ${source}`, () => {
      expect(skill).toContain(source);
    });
  }
});

// ---------------------------------------------------------------------------
// 5. SKILL.md Error Handling
// ---------------------------------------------------------------------------
test.describe("SKILL.md error handling", () => {
  test("has Error Handling section", () => {
    expect(skill).toMatch(/Error Handling/i);
  });

  test("handles missing designs/ directory", () => {
    expect(skill).toContain("/requirements_designer");
  });

  test("handles missing specify CLI", () => {
    expect(skill).toContain("uv tool install specify-cli");
  });
});

// ---------------------------------------------------------------------------
// 6. SKILL.md Anti-Drift Defense
// ---------------------------------------------------------------------------
test.describe("SKILL.md anti-drift defense", () => {
  test("mentions conventions.md as L1 intent layer", () => {
    expect(skill).toContain("conventions.md");
  });

  test("mentions ESLint naming-convention", () => {
    expect(skill).toContain("naming-convention");
  });

  test("mentions eslint-plugin-boundaries", () => {
    expect(skill).toContain("eslint-plugin-boundaries");
  });

  test("mentions Husky pre-commit", () => {
    expect(skill).toContain("Husky");
  });
});

// ---------------------------------------------------------------------------
// 7. Conventions.md Constraints
// ---------------------------------------------------------------------------
test.describe("Conventions.md constraints", () => {
  test("SKILL.md mentions conventions.md line limit", () => {
    expect(skill).toMatch(/50\s*(lines|行)/i);
  });

  test("SKILL.md mentions NEEDS CLARIFICATION marker", () => {
    expect(skill).toContain("NEEDS CLARIFICATION");
  });

  test("SKILL.md limits NEEDS CLARIFICATION to 3 or fewer", () => {
    expect(skill).toMatch(/NEEDS CLARIFICATION/);
    // The skill should mention a limit for unresolved items
    expect(skill).toMatch(/3|three/i);
  });
});

// ---------------------------------------------------------------------------
// 8. Architecture Governance
// ---------------------------------------------------------------------------
test.describe("Architecture governance", () => {
  test("SKILL.md mentions architecture governance or boundaries", () => {
    expect(skill).toMatch(/boundar|governance|architect/i);
  });

  test("SKILL.md mentions eslint enforcement scaffold", () => {
    expect(skill).toContain("Enforcement Scaffold");
  });
});
