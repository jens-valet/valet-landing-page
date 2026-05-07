/**
 * `/presenter` password gate (sessionStorage).
 * Built-in passwords: `123`, `Pitch2026` (case-insensitive).
 * Optional extras: `NEXT_PUBLIC_PRESENTER_ACCESS_PASSWORD` comma-separated (merged with built-ins).
 */

export const PRESENTER_UNLOCK_SESSION_KEY = "valet.presenter.unlocked";

const BUILTIN_PRESENTER_PASSWORDS_LOWER = ["123", "pitch2026"];

function allowedPresenterPasswordsLowercase(): Set<string> {
  const set = new Set(BUILTIN_PRESENTER_PASSWORDS_LOWER);
  const env = process.env.NEXT_PUBLIC_PRESENTER_ACCESS_PASSWORD;
  if (typeof env === "string" && env.trim().length > 0) {
    for (const part of env.split(",")) {
      const t = part.trim().toLowerCase();
      if (t) set.add(t);
    }
  }
  return set;
}

export function presenterPasswordMatches(input: unknown): boolean {
  const n = (typeof input === "string" ? input : "").trim().toLowerCase();
  return n.length > 0 && allowedPresenterPasswordsLowercase().has(n);
}

export function readPresenterUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(PRESENTER_UNLOCK_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function writePresenterUnlocked(): void {
  try {
    sessionStorage.setItem(PRESENTER_UNLOCK_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearPresenterUnlocked(): void {
  try {
    sessionStorage.removeItem(PRESENTER_UNLOCK_SESSION_KEY);
  } catch {
    /* ignore */
  }
}
