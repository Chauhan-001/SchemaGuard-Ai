
import { StudyPlanSchema } from "./studyPlan.js";

const validPlan = {
  topic: "React",
  level: "beginner",
  durationDays: 7,
  dailyTasks: [
    "Learn JSX",
    "Build a component",
  ],
};

const result = StudyPlanSchema.safeParse(validPlan);

if (result.success) {
  console.log("VALID:", result.data);
} else {
  console.error("INVALID:", result.error.issues);
}
