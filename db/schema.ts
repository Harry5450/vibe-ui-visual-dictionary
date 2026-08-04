import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteStats = sqliteTable(
  "site_stats",
  {
    id: integer("id").primaryKey(),
    pageViews: integer("page_views").notNull().default(0),
    uniqueVisitors: integer("unique_visitors").notNull().default(0),
  },
  (table) => [check("site_stats_single_row", sql`${table.id} = 1`)],
);

export const siteVisitors = sqliteTable("site_visitors", {
  visitorId: text("visitor_id").primaryKey(),
  createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
});

export const feedbackMessages = sqliteTable(
  "feedback_messages",
  {
    id: text("id").primaryKey(),
    category: text("category").notNull(),
    message: text("message").notNull(),
    email: text("email"),
    createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
    status: text("status").notNull().default("new"),
  },
  (table) => [
    check(
      "feedback_messages_category",
      sql`${table.category} IN ('bug', 'suggestion', 'component', 'other')`,
    ),
  ],
);
