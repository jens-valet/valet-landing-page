"use client";

import dynamic from "next/dynamic";

const Deck500AppPage = dynamic(() => import("@/components/deck/Deck500AppPage"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "45vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        color: "#8A8678",
      }}
    >
      Loading deck…
    </div>
  ),
});

export default function Deck500AppGate() {
  return <Deck500AppPage />;
}
