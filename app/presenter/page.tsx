import type { Metadata } from "next";

import PresenterGate from "./PresenterGate";

export const metadata: Metadata = {
  title: "Valet — Presenter",
  description: "Presenter cue sheet for the Valet pitch deck.",
};

export default function PresenterRoute() {
  return <PresenterGate />;
}
