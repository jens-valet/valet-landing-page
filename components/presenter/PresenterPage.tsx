"use client";

import { useEffect } from "react";
import PresenterUnlockGate from "@/components/presenter/PresenterUnlockGate";
import ValetPresenterView from "@/components/presenter/ValetPresenterView";

/**
 * Presenter cue sheet — gated like webapp `/presenter`; mirrors `App/webapp/src/pages/Presenter.jsx`.
 */
export default function PresenterPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Valet — Presenter";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <PresenterUnlockGate>
      <ValetPresenterView />
    </PresenterUnlockGate>
  );
}
