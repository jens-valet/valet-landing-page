"use client";

import dynamic from "next/dynamic";

const DeckPage = dynamic(() => import("@/components/deck/DeckPage"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "100vh",
        background: "#1E3A2F",
      }}
      aria-busy="true"
      aria-label="Loading deck"
    />
  ),
});

export default function DeckGate() {
  return <DeckPage />;
}
