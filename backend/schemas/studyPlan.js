
import { z } from "zod";

export const StudyPlanSchema = z.object({
  topic: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  durationDays: z.number().int().min(1).max(90),
  dailyTasks: z.array(z.string().min(1)).min(1),
});
