/**
 * `/deck` password gate (sessionStorage).
 * Stores which unlock path was used so refreshes keep the live demo vs deck-only view.
 */

export const DECK_SESSION_KEY = "valet.deck.session";

export type DeckUnlockMode = "valet" | "pitch";

type DeckSessionPayload = { m: DeckUnlockMode };

export function readDeckSession(): DeckSessionPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DECK_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && "m" in parsed) {
      const m = (parsed as { m: unknown }).m;
      if (m === "valet" || m === "pitch") return { m };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function writeDeckSession(mode: DeckUnlockMode): void {
  try {
    sessionStorage.setItem(DECK_SESSION_KEY, JSON.stringify({ m: mode }));
  } catch {
    /* ignore */
  }
}
