import { env } from "cloudflare:workers";

const CATEGORIES = ["bug", "suggestion", "component", "other"] as const;
type FeedbackCategory = (typeof CATEGORIES)[number];
type ValidatedFeedback = {
  category: FeedbackCategory;
  message: string;
  email: string | null;
};
type ValidationResult = { error: string } | ValidatedFeedback;

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f]/u;

export const dynamic = "force-dynamic";

function getDatabase(): D1Database {
  if (!env.DB) {
    throw new Error("Cloudflare D1 binding `DB` is unavailable.");
  }

  return env.DB;
}

async function ensureSchema(database: D1Database) {
  await database
    .prepare(`
      CREATE TABLE IF NOT EXISTS feedback_messages (
        id TEXT PRIMARY KEY NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('bug', 'suggestion', 'component', 'other')),
        message TEXT NOT NULL,
        email TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        status TEXT NOT NULL DEFAULT 'new'
      )
    `)
    .run();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFeedbackCategory(value: unknown): value is FeedbackCategory {
  return (
    typeof value === "string" &&
    CATEGORIES.includes(value as FeedbackCategory)
  );
}

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

function validatePayload(payload: unknown): ValidationResult {
  if (!isRecord(payload)) {
    return { error: "Request body must be a JSON object." };
  }

  const category = payload.category;
  if (!isFeedbackCategory(category)) {
    return {
      error: "category must be one of bug, suggestion, component, or other.",
    };
  }

  const rawMessage = payload.message;
  if (typeof rawMessage !== "string") {
    return { error: "message is required." };
  }

  const message = rawMessage.trim();
  if (message.length < 10 || message.length > 2000) {
    return { error: "message must be between 10 and 2000 characters." };
  }

  let email: string | null = null;
  if (payload.email !== undefined && payload.email !== null) {
    if (typeof payload.email !== "string") {
      return { error: "email must be a string." };
    }

    if (payload.email.length > 254) {
      return { error: "email must be at most 254 characters." };
    }

    if (CONTROL_CHARACTERS.test(payload.email)) {
      return { error: "email must not contain control characters." };
    }

    const normalizedEmail = payload.email.trim();
    email = normalizedEmail.length > 0 ? normalizedEmail : null;
  }

  return { category, message, email };
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Request body must contain valid JSON.", 400);
  }

  const validated = validatePayload(payload);
  if ("error" in validated) {
    return errorResponse(validated.error, 400);
  }

  try {
    const database = getDatabase();
    await ensureSchema(database);
    await database
      .prepare(`
        INSERT INTO feedback_messages
          (id, category, message, email, created_at, status)
        VALUES (?, ?, ?, ?, unixepoch(), ?)
      `)
      .bind(
        crypto.randomUUID(),
        validated.category,
        validated.message,
        validated.email,
        "new",
      )
      .run();

    return Response.json({ ok: true });
  } catch {
    return errorResponse("Unable to save feedback.", 503);
  }
}
