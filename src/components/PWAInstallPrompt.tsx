"use client";

import { useState, useEffect } from "react";

/**
 * PWA Install prompt — shows "Add to Home Screen" when installable
 */
export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<{ prompt: () => Promise<void> } | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("pjazza-pwa-dismissed");
    if (stored) setDismissed(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as unknown as { prompt: () => Promise<void> });
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (deferredPrompt && !dismissed && !window.matchMedia("(display-mode: standalone)").matches) {
      setShow(true);
    }
  }, [deferredPrompt, dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    if (typeof window !== "undefined") localStorage.setItem("pjazza-pwa-dismissed", "1");
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        left: 16,
        right: 16,
        zIndex: 50,
        maxWidth: 420,
        margin: "0 auto",
        padding: 16,
        background: "var(--pj-surface-card)",
        border: "1px solid var(--pj-border)",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>📱</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--pj-text)", marginBottom: 4 }}>Add PJAZZA to Home Screen</p>
          <p style={{ fontSize: 12, color: "var(--pj-text-secondary)" }}>Install for quick access to Malta&apos;s live marketplace.</p>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{ background: "none", border: "none", color: "var(--pj-text-tertiary)", padding: 4, cursor: "pointer" }}
        >
          ×
        </button>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleInstall}
          className="pj-btn-primary"
          style={{ flex: 1, padding: 12, fontSize: 14 }}
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="pj-btn-ghost"
          style={{ padding: 12, fontSize: 14 }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
