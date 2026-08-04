"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import type { FeedbackRecord, FeedbackStatus } from "./data";

type FeedbackDashboardProps = {
  initialFeedback: FeedbackRecord[];
  adminName: string;
};

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  new: "敺???,
  processing: "??銝?,
  done: "撌脣???,
};

const CATEGORY_LABELS: Record<FeedbackRecord["category"], string> = {
  bug: "?航炊?",
  suggestion: "雿輻撱箄降",
  component: "?啣??辣",
  other: "?嗡???",
};

const FILTERS: Array<"all" | FeedbackStatus> = ["all", "new", "processing", "done"];

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp * 1000));
}

export default function FeedbackDashboard({ initialFeedback, adminName }: FeedbackDashboardProps) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [filter, setFilter] = useState<"all" | FeedbackStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/feedback")
      .then(async (response) => {
        if (response.status === 401) {
          if (active) setHasAccess(false);
          return null;
        }
        if (!response.ok) throw new Error("Unable to load feedback");
        return response.json() as Promise<{ feedback: FeedbackRecord[] }>;
      })
      .then((payload) => {
        if (active && payload) setFeedback(payload.feedback);
      })
      .catch(() => {
        if (active) setError("??頛憭望?嚗???渡????");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const visibleFeedback = useMemo(
    () => filter === "all" ? feedback : feedback.filter((item) => item.status === filter),
    [feedback, filter],
  );

  const counts = useMemo(() => ({
    all: feedback.length,
    new: feedback.filter((item) => item.status === "new").length,
    processing: feedback.filter((item) => item.status === "processing").length,
    done: feedback.filter((item) => item.status === "done").length,
  }), [feedback]);

  async function changeStatus(id: string, status: FeedbackStatus) {
    setUpdatingId(id);
    setError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) throw new Error("Unable to update feedback");
      setFeedback((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    } catch {
      setError("???啣仃??隢?敺?閰艾?");
    } finally {
      setUpdatingId(null);
    }
  }

  if (!loading && !hasAccess) {
    return (
      <main className="feedback-denied-shell">
        <div className="feedback-denied-card">
          <span className="eyebrow">VIBE UI / FEEDBACK</span>
          <h1>???Ｗ?蝯衣恣??/h1>
          <p>隢蝙?冽?蝞∠?甈???ChatGPT 撣唾??餃嚗???辣摮蝜潛??汗??/p>
          <Link className="feedback-back-link" href="/">??辣摮</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="feedback-admin-shell">
      <header className="feedback-admin-header">
        <div>
          <Link className="feedback-admin-brand" href="/">VIBE UI / VISUAL DICTIONARY</Link>
          <span className="eyebrow">FEEDBACK INBOX</span>
          <h1>???嗡辣??/h1>
          <p>?剁?{adminName}??ㄐ?渡?雿輻???航炊??遣霅啜?/p>
        </div>
        <Link className="feedback-back-link" href="/">?摮 ??/Link>
      </header>

      <section className="feedback-summary-grid" aria-label="??蝯梯?">
        <div className="feedback-summary-card feedback-summary-card-primary">
          <span>?券??</span>
          <strong>{counts.all}</strong>
          <small>???200 蝑?/small>
        </div>
        <div className="feedback-summary-card"><span>敺???/span><strong>{counts.new}</strong><small>?閬??亦?</small></div>
        <div className="feedback-summary-card"><span>??銝?/span><strong>{counts.processing}</strong><small>甇?閬?</small></div>
        <div className="feedback-summary-card"><span>撌脣???/span><strong>{counts.done}</strong><small>撌脩???</small></div>
      </section>

      <section className="feedback-inbox-panel">
        <div className="feedback-inbox-toolbar">
          <div>
            <span className="eyebrow">INBOX</span>
            <h2>???擖?/h2>
          </div>
          <div className="feedback-filters" role="tablist" aria-label="????祟??>
            {FILTERS.map((value) => (
              <button
                key={value}
                className={filter === value ? "is-active" : ""}
                onClick={() => setFilter(value)}
                type="button"
              >
                {value === "all" ? "?券" : STATUS_LABELS[value]} <span>{counts[value]}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="feedback-admin-error" role="alert">{error}</p>}

        {loading ? (
          <div className="feedback-empty-state"><strong>甇?頛????/strong></div>
        ) : visibleFeedback.length === 0 ? (
          <div className="feedback-empty-state">
            <strong>?桀?瘝?????????/strong>
            <p>?啁?雿輻?遣霅唳??券敺?曉?ㄐ??/p>
          </div>
        ) : (
          <div className="feedback-list">
            {visibleFeedback.map((item) => (
              <article className="feedback-admin-item" key={item.id}>
                <div className="feedback-admin-item-topline">
                  <span className={`feedback-category feedback-category-${item.category}`}>{CATEGORY_LABELS[item.category]}</span>
                  <time dateTime={new Date(item.created_at * 1000).toISOString()}>{formatDate(item.created_at)}</time>
                </div>
                <p className="feedback-admin-message">{item.message}</p>
                <div className="feedback-admin-item-footer">
                  {item.email ? <a href={`mailto:${item.email}`}>{item.email}</a> : <span>?芣?靘蝯?Email</span>}
                  <label>
                    <span className="sr-only">?湔???/span>
                    <select
                      value={item.status}
                      disabled={updatingId === item.id}
                      onChange={(event) => changeStatus(item.id, event.target.value as FeedbackStatus)}
                    >
                      {Object.entries(STATUS_LABELS).map(([status, label]) => <option key={status} value={status}>{label}</option>)}
                    </select>
                  </label>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

