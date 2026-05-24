import type { Metadata } from "next";
import Deck500AppGate from "./DeckGate";

export const metadata: Metadata = {
  title: "Valet — Deck",
  description: "Valet seed round pitch deck.",
};

export default function Deck500AppRoute() {
  return <Deck500AppGate />;
}
