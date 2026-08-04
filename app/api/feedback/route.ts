import { ensureFeedbackSchema, FEEDBACK_STATUSES, getFeedbackDatabase, listFeedback, updateFeedbackStatus } from "../../feedback/data";
import { getFeedbackAdmin } from "../../feedback/access";
import { notifyFeedback } from "../../feedback/notify";

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

function isFeedbackStatus(value: unknown): value is (typeof FEEDBACK_STATUSES)[number] {
  return typeof value === "string" && FEEDBACK_STATUSES.includes(value as (typeof FEEDBACK_STATUSES)[number]);
}

async function requireAdmin() {
  const admin = await getFeedbackAdmin();
  return admin;
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

  const id = crypto.randomUUID();
  try {
    const database = getFeedbackDatabase();
    await ensureFeedbackSchema(database);
    await database
      .prepare(`
        INSERT INTO feedback_messages
          (id, category, message, email, created_at, status)
        VALUES (?, ?, ?, ?, unixepoch(), ?)
      `)
      .bind(id, validated.category, validated.message, validated.email, "new")
      .run();

    let emailSent = false;
    try {
      emailSent = await notifyFeedback({ id, ...validated });
    } catch (error) {
      console.error("Feedback email notification failed", error);
    }

    return Response.json({ ok: true, emailSent });
  } catch {
    return errorResponse("Unable to save feedback.", 503);
  }
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return errorResponse("You are not authorized to view feedback.", 401);
  }

  try {
    const database = getFeedbackDatabase();
    await ensureFeedbackSchema(database);
    return Response.json({ feedback: await listFeedback(database) });
  } catch {
    return errorResponse("Unable to load feedback.", 503);
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return errorResponse("You are not authorized to update feedback.", 401);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Request body must contain valid JSON.", 400);
  }

  if (!isRecord(payload) || typeof payload.id !== "string" || !isFeedbackStatus(payload.status)) {
    return errorResponse("id and a valid status are required.", 400);
  }

  try {
    const database = getFeedbackDatabase();
    await ensureFeedbackSchema(database);
    const result = await updateFeedbackStatus(database, payload.id, payload.status);
    if (!result.meta.changes) {
      return errorResponse("Feedback not found.", 404);
    }
    return Response.json({ ok: true });
  } catch {
    return errorResponse("Unable to update feedback.", 503);
  }
}

