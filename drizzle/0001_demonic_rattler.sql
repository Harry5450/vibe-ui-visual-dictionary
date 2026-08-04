CREATE TABLE `feedback_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`message` text NOT NULL,
	`email` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	CONSTRAINT "feedback_messages_category" CHECK("feedback_messages"."category" IN ('bug', 'suggestion', 'component', 'other'))
);
