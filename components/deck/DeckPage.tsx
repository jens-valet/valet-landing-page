"use client";

import { useEffect } from "react";
import PitchDeckSlash from "@/components/deck/PitchDeckSlash";

/**
 * Mirrors webapp `Deck.jsx` for the public investor deck (no Supabase demo cleanup on landing).
 * Loaded from `DeckGate` via `next/dynamic` with `{ ssr: false }` so Recharts initializes only in a client chunk.
 */
export default function DeckPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Valet — Deck";
    return () => {
      document.title = prev;
    };
  }, []);

  return <PitchDeckSlash embedLiveProductDemo />;
}
