"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { DeckLogoWhiteGoldLineImg } from "@/components/deck/deckBranding";
import {
  clearPresenterUnlocked,
  presenterPasswordMatches,
  readPresenterUnlocked,
  writePresenterUnlocked,
} from "@/lib/presenterAccess";

/**
 * Password gate for `/presenter`. Accepts `123` and `Pitch2026` (case-insensitive), plus optional comma-separated env extras.
 */
export default function PresenterUnlockGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  useEffect(() => {
    setUnlocked(readPresenterUnlocked());
  }, []);

  const handleUnlock = useCallback(() => {
    if (presenterPasswordMatches(pw)) {
      writePresenterUnlocked();
      setUnlocked(true);
      setPwError(false);
    } else {
      setPwError(true);
      window.setTimeout(() => setPwError(false), 1500);
    }
  }, [pw]);

  if (unlocked) {
    return <>{children}</>;
  }

  const shell: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 24px",
    textAlign: "center",
    background: "#1E3A2F",
    color: "#F5F0E8",
  };

  return (
    <div style={shell}>
      <p
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginBottom: 16,
          opacity: 0.6,
          color: "#D4BF92",
        }}
      >
        Valet · Presenter view
      </p>
      <div style={{ marginBottom: 24, width: "100%", maxWidth: 360 }}>
        <DeckLogoWhiteGoldLineImg maxWidth={320} />
      </div>
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
          maxWidth: 448,
          marginBottom: 40,
          opacity: 0.9,
          color: "#D4BF92",
        }}
      >
        Enter the presenter password to continue.
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 10,
          width: "100%",
          maxWidth: 384,
        }}
        className="presenter-gate-row"
      >
        <style>{`
          @media (min-width: 640px) {
            .presenter-gate-row { flex-direction: row; align-items: center; }
            .presenter-gate-row button { width: auto; }
          }
        `}</style>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
          placeholder="Password"
          aria-label="Presenter password"
          style={{
            width: "100%",
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: "solid",
            padding: "10px 16px",
            fontSize: 14,
            outline: "none",
            fontFamily: "'DM Mono', monospace",
            background: "#2D4A3E",
            color: "#F5F0E8",
            borderColor: pwError ? "#A0453A" : "rgba(74, 122, 98, 0.5)",
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={handleUnlock}
          style={{
            width: "100%",
            flexShrink: 0,
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: "solid",
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'DM Mono', monospace",
            background: "rgba(196, 169, 114, 0.15)",
            color: "#C4A972",
            borderColor: "rgba(196, 169, 114, 0.35)",
            boxSizing: "border-box",
          }}
        >
          Enter
        </button>
      </div>
      {pwError ? (
        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
            color: "#A0453A",
          }}
        >
          Incorrect password
        </p>
      ) : null}
      <button
        type="button"
        style={{
          marginTop: 48,
          fontSize: 12,
          textDecoration: "underline",
          opacity: 0.4,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Outfit', sans-serif",
          color: "inherit",
        }}
        onClick={() => {
          clearPresenterUnlocked();
          setPw("");
          setUnlocked(false);
        }}
      >
        Clear unlock (this tab)
      </button>
    </div>
  );
}
