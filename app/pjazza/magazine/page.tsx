"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import PjAppShell from "@/components/PjAppShell";

const ARTICLES = [
  {
    id: "sunset-spots",
    title: "5 Best Sunset Spots in Malta",
    excerpt: "From Valletta's Upper Barrakka to the cliffs of Dingli.",
    date: "Feb 2026",
    slug: "sunset-spots",
  },
  {
    id: "street-food",
    title: "Malta Street Food Guide",
    excerpt: "Pastizzi, ftira, hobz biz-zejt — where to find the real deal.",
    date: "Jan 2026",
    slug: "street-food",
  },
  {
    id: "hidden-beaches",
    title: "Hidden Beaches Locals Love",
    excerpt: "Quiet coves beyond the tourist hotspots.",
    date: "Jan 2026",
    slug: "hidden-beaches",
  },
];

export default function MagazinePage() {
  const router = useRouter();

  return (
    <PjAppShell>
      <div className="pj-safe-bottom" style={{ minHeight: "100vh", background: "var(--pj-black)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--pj-border)" }}>
          <button
            onClick={() => router.back()}
            className="pj-touch"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              color: "var(--pj-text-secondary)",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "var(--pj-surface-1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={24} style={{ color: "var(--pj-gold)" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--pj-text)", marginBottom: 4 }}>
                PJAZZA Magazine
              </h1>
              <p style={{ fontSize: 14, color: "var(--pj-text-tertiary)" }}>
                Malta guides, food, and hidden gems.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {ARTICLES.map((a) => (
              <article
                key={a.id}
                className="pj-card pj-touch"
                style={{
                  padding: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                }}
                onClick={() => {}}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--pj-text-tertiary)",
                      marginBottom: 6,
                      display: "block",
                    }}
                  >
                    {a.date}
                  </span>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--pj-text)", marginBottom: 8 }}>
                    {a.title}
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--pj-text-tertiary)", lineHeight: 1.5 }}>
                    {a.excerpt}
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: "var(--pj-text-tertiary)", flexShrink: 0 }} />
              </article>
            ))}
          </div>

          <p style={{ fontSize: 12, color: "var(--pj-text-tertiary)", marginTop: 24 }}>
            Static editorial. Add article pages and CMS integration in V2.
          </p>
        </div>
      </div>
    </PjAppShell>
  );
}
