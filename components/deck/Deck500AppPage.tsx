"use client";

import { useEffect } from "react";
import PitchDeckSlash from "@/components/deck/PitchDeckSlash";

/** Public 500 Startups deck link — full deck, no password, product demo locked. */
export default function Deck500AppPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Valet — Deck";
    return () => {
      document.title = prev;
    };
  }, []);

  return <PitchDeckSlash gateAutoUnlocked autoUnlockMode="valet" />;
}
