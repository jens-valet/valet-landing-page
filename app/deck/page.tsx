import type { Metadata } from "next";
import DeckGate from "./DeckGate";

export const metadata: Metadata = {
  title: "Valet — Deck",
  description: "Valet seed round pitch deck.",
};

export default function DeckRoute() {
  return <DeckGate />;
}
