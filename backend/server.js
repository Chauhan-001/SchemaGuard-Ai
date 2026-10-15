
import express from "express";
import cors from "cors";
import "dotenv/config";
import Groq from "groq-sdk";
import { StudyPlanSchema } from "./schemas/studyPlan.js";

const app = express();
const PORT = 3000;
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(cors());
app.use(express.json());




app.post("/api/generate-study-plan", async (req, res) => {
  const topic = req.body?.topic;

  if (typeof topic !== "string" || topic.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Please provide a topic with at least 2 characters.",
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "Generate a practical study plan. Return only a JSON object with topic, level, durationDays, and dailyTasks. level must be beginner, intermediate, or advanced. durationDays must be an integer from 1 to 90. dailyTasks must be an array of non-empty strings.",
        },
        {
          role: "user",
          content: `Create a study plan for: ${topic} the time you think needed really not any fixed number of days give best and reasonable`,
        },
      ],
      temperature: 1.0,

response_format: {
  type: "json_schema",
  json_schema: {
    name: "study_plan",
    strict: true,
    schema: {
      type: "object",
      properties: {
        topic: {
          type: "string"
        },
        level: {
          type: "string",
          enum: ["beginner", "intermediate", "advanced"]
        },
        durationDays: {
          type: "integer"
        },
        dailyTasks: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },
      required: [
        "topic",
        "level",
        "durationDays",
        "dailyTasks"
      ],
      additionalProperties: false
    }
  }
},
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return res.status(502).json({
        success: false,
        message: "The AI returned an empty response.",
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      return res.status(502).json({
        success: false,
        message: "The AI returned invalid JSON.",
      });
    }

    const validation = StudyPlanSchema.safeParse(parsed);

    if (!validation.success) {
      return res.status(502).json({
        success: false,
        message: "The AI response did not match the required schema.",
        errors: validation.error.issues,
      });
    }

    return res.json({
      success: true,
      data: validation.data,
    });
  } catch (error) {
    console.error("Study plan generation failed:", error.message);

    return res.status(502).json({
      success: false,
      message: "Study plan generation failed.",
    });
  }
});



//for playground
app.post("/api/validate-study-plan", (req, res) => {
  const result = StudyPlanSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Schema validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      })),
    });
  }

  return res.status(200).json({
    success: true,
    message: "Schema validation passed",
    data: result.data,
  });
});



app.listen(PORT, () => {
  console.log(`SchemaGuard API running at http://localhost:${PORT}`);
});
