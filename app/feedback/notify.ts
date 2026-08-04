import { env } from "cloudflare:workers";

type FeedbackNotification = {
  id: string;
  category: "bug" | "suggestion" | "component" | "other";
  message: string;
  email: string | null;
};

const CATEGORY_LABELS: Record<FeedbackNotification["category"], string> = {
  bug: "?航炊?",
  suggestion: "雿輻撱箄降",
  component: "?啣??辣",
  other: "?嗡???",
};

function getEnvironmentValue(key: string): string {
  const value = (env as unknown as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}

function getRecipients(): string[] {
  return getEnvironmentValue("FEEDBACK_NOTIFY_EMAIL")
    .split(/[;,\n]/u)
    .map((email) => email.trim())
    .filter(Boolean);
}

export async function notifyFeedback(feedback: FeedbackNotification): Promise<boolean> {
  const apiKey = getEnvironmentValue("RESEND_API_KEY");
  const from = getEnvironmentValue("FEEDBACK_FROM_EMAIL");
  const recipients = getRecipients();

  if (!apiKey || !from || recipients.length === 0) {
    return false;
  }

  const replyTo = feedback.email ? { reply_to: feedback.email } : {};
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "Vibe UI Feedback/1.0",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject: `[Vibe UI] ${CATEGORY_LABELS[feedback.category]}`,
      text: [
        `憿?嚗?{CATEGORY_LABELS[feedback.category]}`,
        `??蝺刻?嚗?{feedback.id}`,
        `?舐窗 Email嚗?{feedback.email ?? "?芣?靘?}`,
        "",
        "???批捆嚗?,
        feedback.message,
      ].join("\n"),
      ...replyTo,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend notification failed with status ${response.status}.`);
  }

  return true;
}


