CREATE TABLE `site_stats` (
	`id` integer PRIMARY KEY NOT NULL,
	`page_views` integer DEFAULT 0 NOT NULL,
	`unique_visitors` integer DEFAULT 0 NOT NULL,
	CONSTRAINT "site_stats_single_row" CHECK("site_stats"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `site_visitors` (
	`visitor_id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
