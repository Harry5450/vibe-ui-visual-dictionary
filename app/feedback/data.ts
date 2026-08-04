import { env } from "cloudflare:workers";

export const FEEDBACK_STATUSES = ["new", "processing", "done"] as const;
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export type FeedbackRecord = {
  id: string;
  category: "bug" | "suggestion" | "component" | "other";
  message: string;
  email: string | null;
  created_at: number;
  status: FeedbackStatus;
};

export function getFeedbackDatabase(): D1Database {
  if (!env.DB) {
    throw new Error("Cloudflare D1 binding `DB` is unavailable.");
  }

  return env.DB;
}

export async function ensureFeedbackSchema(database: D1Database) {
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

export async function listFeedback(database: D1Database): Promise<FeedbackRecord[]> {
  const result = await database
    .prepare(`
      SELECT id, category, message, email, created_at, status
      FROM feedback_messages
      ORDER BY created_at DESC
      LIMIT 200
    `)
    .all<FeedbackRecord>();

  return result.results ?? [];
}

export async function updateFeedbackStatus(
  database: D1Database,
  id: string,
  status: FeedbackStatus,
) {
  return database
    .prepare("UPDATE feedback_messages SET status = ? WHERE id = ?")
    .bind(status, id)
    .run();
}


