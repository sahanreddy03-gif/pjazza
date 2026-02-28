"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Users, ExternalLink, MessageCircle } from "lucide-react";
import PjAppShell from "@/components/PjAppShell";

const COMMUNITIES = [
  {
    id: "indian",
    label: "Indian Community",
    desc: "Connect with Indian expats and visitors in Malta.",
    link: "https://t.me/malta_indian",
    platform: "Telegram",
  },
  {
    id: "muslim",
    label: "Muslim Community",
    desc: "Halal dining, mosques, and community events.",
    link: "https://chat.whatsapp.com/malta-muslim",
    platform: "WhatsApp",
  },
  {
    id: "digital-nomad",
    label: "Digital Nomads",
    desc: "Remote workers, co-working, and coliving in Malta.",
    link: "https://t.me/malta_nomads",
    platform: "Telegram",
  },
  {
    id: "british",
    label: "British Expats",
    desc: "UK nationals living in or visiting Malta.",
    link: "https://chat.whatsapp.com/malta-british",
    platform: "WhatsApp",
  },
];

export default function CommunityPage() {
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
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
              <Users size={24} style={{ color: "var(--pj-gold)" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--pj-text)", marginBottom: 4 }}>
                Community boards
              </h1>
              <p style={{ fontSize: 14, color: "var(--pj-text-tertiary)" }}>
                Join groups for Indian, Muslim, Digital Nomad, and British communities in Malta.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {COMMUNITIES.map((c) => (
              <a
                key={c.id}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="pj-card pj-touch"
                style={{
                  padding: 20,
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "var(--pj-surface-1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MessageCircle size={22} style={{ color: "var(--pj-text-secondary)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--pj-text)", marginBottom: 4 }}>
                    {c.label}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--pj-text-tertiary)", lineHeight: 1.4 }}>
                    {c.desc}
                  </p>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--pj-gold)",
                      marginTop: 6,
                      display: "inline-block",
                    }}
                  >
                    Join on {c.platform} →
                  </span>
                </div>
                <ExternalLink size={18} style={{ color: "var(--pj-text-tertiary)", flexShrink: 0 }} />
              </a>
            ))}
          </div>

          <p style={{ fontSize: 12, color: "var(--pj-text-tertiary)", marginTop: 24 }}>
            Links are placeholders. Update with real WhatsApp/Telegram group invites.
          </p>
        </div>
      </div>
    </PjAppShell>
  );
}
