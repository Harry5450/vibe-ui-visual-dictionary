import { requireChatGPTUser } from "../chatgpt-auth";
import FeedbackDashboard from "./FeedbackDashboard";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const user = await requireChatGPTUser("/feedback");

  return <FeedbackDashboard initialFeedback={[]} adminName={user.displayName} />;
}

