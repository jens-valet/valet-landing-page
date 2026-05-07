"use client";

import dynamic from "next/dynamic";

/**
 * Recharts + the full deck are heavy and CommonJS-interop-sensitive; loading them only in a
 * client-only dynamic chunk avoids intermittent webpack runtime
 * `__webpack_modules__[moduleId] is not a function` when the route hydrates.
 */
const DeckPage = dynamic(() => import("@/components/deck/DeckPage"), {
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

export default function DeckGate() {
  return <DeckPage />;
}
