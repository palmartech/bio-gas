import test from "node:test";
import assert from "node:assert/strict";
import { evaluateAssessment } from "./assessment.ts";

const complete = {
  state: "Lagos", town: "Ikeja", propertyType: "home", households: "1", sanitation: "septic", alterExisting: "no", wasteSources: ["food"], space: "yes", energyGoal: "cooking", spendBand: "20k-50k",
};

test("complete cooking-only enquiry is ready for a survey conversation", () => {
  const result = evaluateAssessment(complete);
  assert.equal(result.tier, "survey");
  assert.equal(result.reviewFlags.length, 0);
});

test("generator interest always requires specialist review", () => {
  const result = evaluateAssessment({ ...complete, energyGoal: "electricity" });
  assert.equal(result.tier, "specialist");
  assert.match(result.reviewFlags.join(" "), /generator/i);
});

test("changes to existing sanitation always require specialist review", () => {
  const result = evaluateAssessment({ ...complete, sanitation: "soakaway", alterExisting: "yes" });
  assert.equal(result.tier, "specialist");
  assert.match(result.reviewFlags.join(" "), /sanitation/i);
});

test("unknown core details remain visible without inferring feasibility", () => {
  const result = evaluateAssessment({ ...complete, sanitation: "unsure", space: "unsure" });
  assert.equal(result.tier, "information");
  assert.equal(result.openQuestions.length, 2);
});

test("specialist flags take precedence when information is also missing", () => {
  const result = evaluateAssessment({ ...complete, state: "", energyGoal: "both" });
  assert.equal(result.tier, "specialist");
  assert.match(result.openQuestions.join(" "), /state/i);
});
