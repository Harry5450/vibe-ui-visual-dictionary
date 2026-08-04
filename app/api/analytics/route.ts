import { env } from "cloudflare:workers";

const VISITOR_COOKIE = "vibe_ui_visitor_id";
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const VISITOR_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

export const dynamic = "force-dynamic";

function getDatabase(): D1Database {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB`.",
    );
  }

  return env.DB;
}

async function ensureSchema(database: D1Database) {
  await database.batch([
    database.prepare(`
      CREATE TABLE IF NOT EXISTS site_stats (
        id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
        page_views INTEGER NOT NULL DEFAULT 0,
        unique_visitors INTEGER NOT NULL DEFAULT 0
      )
    `),
    database.prepare(`
      CREATE TABLE IF NOT EXISTS site_visitors (
        visitor_id TEXT PRIMARY KEY NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      )
    `),
    database.prepare(`
      INSERT OR IGNORE INTO site_stats (id, page_views, unique_visitors)
      VALUES (1, 0, 0)
    `),
    database.prepare(`
      CREATE TRIGGER IF NOT EXISTS site_visitors_increment_unique
      AFTER INSERT ON site_visitors
      BEGIN
        UPDATE site_stats
        SET unique_visitors = unique_visitors + 1
        WHERE id = 1;
      END
    `),
  ]);
}

function readVisitorId(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    for (const cookie of cookieHeader.split(";")) {
      const separator = cookie.indexOf("=");
      if (separator === -1) continue;

      const name = cookie.slice(0, separator).trim();
      if (name !== VISITOR_COOKIE) continue;

      const value = cookie.slice(separator + 1).trim();
      if (VISITOR_ID_PATTERN.test(value)) return value;
      break;
    }
  }

  return crypto.randomUUID();
}

function setVisitorCookie(response: Response, visitorId: string) {
  response.headers.set(
    "Set-Cookie",
    `${VISITOR_COOKIE}=${visitorId}; Max-Age=${VISITOR_COOKIE_MAX_AGE}; Path=/; HttpOnly; SameSite=Lax`,
  );
  return response;
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  return Response.json({ error: message }, { status: 503 });
}

async function readCounts(database: D1Database) {
  const row = await database
    .prepare(
      `SELECT page_views AS pageViews, unique_visitors AS uniqueVisitors
       FROM site_stats
       WHERE id = 1`,
    )
    .first<{ pageViews: number; uniqueVisitors: number }>();

  return {
    pageViews: Number(row?.pageViews ?? 0),
    uniqueVisitors: Number(row?.uniqueVisitors ?? 0),
  };
}

export async function GET() {
  try {
    const database = getDatabase();
    await ensureSchema(database);
    return Response.json(await readCounts(database));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const database = getDatabase();
    await ensureSchema(database);

    const visitorId = readVisitorId(request);
    await database.batch([
      database
        .prepare(
          `INSERT OR IGNORE INTO site_visitors (visitor_id, created_at)
           VALUES (?, unixepoch())`,
        )
        .bind(visitorId),
      database.prepare(
        `UPDATE site_stats
         SET page_views = page_views + 1
         WHERE id = 1`,
      ),
    ]);

    return setVisitorCookie(Response.json(await readCounts(database)), visitorId);
  } catch (error) {
    return errorResponse(error);
  }
}
