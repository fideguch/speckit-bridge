import { test, expect } from "@playwright/test";
import { join } from "path";
import { ROOT, readFile } from "./helpers";

const SKILL_PATH = join(ROOT, "SKILL.md");
const skill = readFile(SKILL_PATH);

// ---------------------------------------------------------------------------
// 1. Progress Layer (Session Resume)
// ---------------------------------------------------------------------------
test.describe("Progress layer", () => {
  test("SKILL.md defines bridge-progress.json for session resume", () => {
    expect(skill).toContain("bridge-progress");
  });

  test("SKILL.md describes resume from last completed step", () => {
    expect(skill).toMatch(/再開|resume|中断/i);
  });
});

// ---------------------------------------------------------------------------
// 2. Evaluator Separation (Harness Feedback Layer)
// ---------------------------------------------------------------------------
test.describe("Evaluator separation", () => {
  test("SKILL.md separates generation from evaluation in Step 5", () => {
    // Step 5 should mention independent/separate evaluation
    expect(skill).toMatch(/[Ee]valuator/);
  });

  test("SKILL.md requires grep-based ID cross-check", () => {
    expect(skill).toMatch(/grep|突合|ID.*照合|cross.?check/i);
  });

  test("SKILL.md defines re-generation trigger on score gap", () => {
    expect(skill).toMatch(/再生成|re.?generat|乖離|gap/i);
  });
});

// ---------------------------------------------------------------------------
// 3. Escalation Ladder (Harness Enforcement)
// ---------------------------------------------------------------------------
test.describe("Escalation ladder", () => {
  test("SKILL.md or constitution template defines enforcement levels", () => {
    expect(skill).toMatch(/L1.*L2|L2.*L3|Enforcement Ladder/i);
  });

  test("SKILL.md mentions 4-layer defense with escalation", () => {
    expect(skill).toMatch(/L1.*Intent|L2.*Guard|L3.*Gate/i);
  });
});

// ---------------------------------------------------------------------------
// 4. Sprint Contract Pattern
// ---------------------------------------------------------------------------
test.describe("Sprint contract pattern", () => {
  test("SKILL.md defines Sprint Contracts section in spec.md", () => {
    expect(skill).toMatch(/Sprint Contract/i);
  });

  test("SKILL.md specifies testable success criteria per sprint", () => {
    expect(skill).toMatch(/Deliverable|Validation|Accept if|テスト可能な成功基準/i);
  });
});

// ---------------------------------------------------------------------------
// 5. Conventions 50-line HARD-GATE
// ---------------------------------------------------------------------------
test.describe("Conventions hard gate", () => {
  test("SKILL.md enforces 50-line limit on conventions.md", () => {
    expect(skill).toMatch(/50.*line|50.*行/i);
  });

  test("examples/after/conventions.md is under 50 lines", () => {
    const conventions = readFile(join(ROOT, "examples", "after", "conventions.md"));
    const lineCount = conventions.split("\n").length;
    expect(lineCount).toBeLessThanOrEqual(50);
  });
});
