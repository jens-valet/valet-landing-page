"use client";

import { useEffect } from "react";
import PitchDeckSlash from "@/components/deck/PitchDeckSlash";

/**
 * Mirrors webapp `Deck.jsx` for the public investor deck (no Supabase demo cleanup on landing).
 * Loaded only on the client via `dynamic(..., { ssr: false })` from `app/deck/page.tsx`.
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
