import { env } from "cloudflare:workers";

import type { ChatGPTUser } from "../chatgpt-auth";
import { getChatGPTUser } from "../chatgpt-auth";

function getEnvironmentValue(key: string): string {
  const value = (env as unknown as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}

function getConfiguredAdminEmails(): string[] {
  return getEnvironmentValue("FEEDBACK_ADMIN_EMAIL")
    .split(/[;,\n]/u)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isFeedbackAdmin(user: ChatGPTUser | null): boolean {
  if (!user) return false;
  const allowedEmails = getConfiguredAdminEmails();
  return allowedEmails.includes(user.email.trim().toLowerCase());
}

export async function getFeedbackAdmin(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  return isFeedbackAdmin(user) ? user : null;
}


