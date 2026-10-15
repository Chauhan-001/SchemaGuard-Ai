import test from "node:test";
import assert from "node:assert/strict";
import { StudyPlanSchema } from "../schemas/studyPlan.js";

const validPlan = {
  topic: "React",
  level: "beginner",
  durationDays: 7,
  dailyTasks: ["Learn JSX", "Build a component"],
};

test("accepts a valid study plan", () => {
  const result = StudyPlanSchema.safeParse(validPlan);

  assert.equal(result.success, true);
});

test("rejects an unsupported level", () => {
  const result = StudyPlanSchema.safeParse({
    ...validPlan,
    level: "expert",
  });

  assert.equal(result.success, false);
});

test("rejects a duration above 90 days", () => {
  const result = StudyPlanSchema.safeParse({
    ...validPlan,
    durationDays: 100,
  });

  assert.equal(result.success, false);
});

test("rejects an empty task list", () => {
  const result = StudyPlanSchema.safeParse({
    ...validPlan,
    dailyTasks: [],
  });

  assert.equal(result.success, false);
});