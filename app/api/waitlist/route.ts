import { NextRequest, NextResponse } from "next/server";

const MAX_BODY_BYTES = 8192;

/** Permissive sanity check — avoids rejecting valid addresses that strict regexes miss. */
function isPlausibleEmail(s: string): boolean {
  if (s.length < 3 || s.length > 254 || /\s/.test(s)) return false;
  const at = s.lastIndexOf("@");
  if (at <= 0 || at === s.length - 1) return false;
  const domain = s.slice(at + 1);
  if (!domain.includes(".")) return false;
  return true;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function isDuplicateConflict(status: number, body: string): boolean {
  if (status === 409) return true;
  try {
    const parsed = JSON.parse(body) as { code?: string };
    return parsed.code === "23505";
  } catch {
    return (
      body.includes("23505") || /duplicate key/i.test(body) || /unique constraint/i.test(body)
    );
  }
}

/** Project root only, e.g. `https://xyz.supabase.co` — not `/rest/v1`. */
function supabaseProjectUrl(raw: string): string {
  let u = raw.trim().replace(/^["']|["']$/g, "");
  u = u.replace(/\/$/, "");
  u = u.replace(/\/rest\/v1\/?$/i, "");
  u = u.replace(/\/$/, "");
  return u;
}

export async function POST(req: NextRequest) {
  let parsed: unknown;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return jsonError("Request too large", 413);
    }
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    return jsonError("Invalid JSON", 400);
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return jsonError("Invalid payload", 400);
  }

  const body = parsed as Record<string, unknown>;
  const honeypot = typeof body.website === "string" ? body.website : "";
  if (honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const emailRaw = typeof body.email === "string" ? body.email : "";
  const email = emailRaw.trim().toLowerCase();
  if (!email || !isPlausibleEmail(email)) {
    return jsonError("Enter a valid email address", 422);
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceKey) {
    return jsonError(
      "Server configuration error. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for the landing app (see .env.example).",
      500,
    );
  }

  const headerReferrer = req.headers.get("referer");
  const bodyReferrer = typeof body.referrer === "string" ? body.referrer.trim() : "";
  const referrer =
    headerReferrer?.slice(0, 2048) ?? (bodyReferrer ? bodyReferrer.slice(0, 2048) : null);
  const userAgent = req.headers.get("user-agent")?.slice(0, 2048) ?? null;

  const base = supabaseProjectUrl(supabaseUrl);
  if (!base.startsWith("http://") && !base.startsWith("https://")) {
    return jsonError(
      "SUPABASE_URL must start with https:// (copy Project URL from Supabase → Settings → Data API / API).",
      500,
    );
  }
  const insertUrl = `${base}/rest/v1/waitlist_signups`;

  const res = await fetch(insertUrl, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      email,
      source: "landing",
      referrer,
      user_agent: userAgent,
    }),
  });

  if (res.ok) {
    return NextResponse.json({ ok: true, created: true });
  }

  const errText = await res.text();
  if (isDuplicateConflict(res.status, errText)) {
    return NextResponse.json({ ok: true, created: false });
  }

  if (process.env.NODE_ENV === "development") {
    console.error("[waitlist] Supabase POST failed", res.status, errText);
  }

  let userMessage = "Something went wrong. Please try again.";
  try {
    const err = JSON.parse(errText) as { code?: string; message?: string };
    const msg = err.message ?? "";
    if (
      err.code === "PGRST125" ||
      (msg.includes("Invalid path") && msg.includes("request URL"))
    ) {
      userMessage =
        "Invalid Supabase API URL. Set SUPABASE_URL to the project root only (e.g. https://YOUR_REF.supabase.co) — do not include /rest/v1.";
    } else if (
      err.code === "PGRST205" ||
      msg.includes("Could not find the table") ||
      (msg.includes("relation") && msg.includes("does not exist"))
    ) {
      userMessage =
        "Waitlist storage is not set up yet. Apply the `waitlist_signups` migration to your Supabase project.";
    } else if (res.status === 401 || res.status === 403) {
      userMessage =
        "Database authorization failed. Use SUPABASE_SERVICE_ROLE_KEY (not the anon key) on the server.";
    }
  } catch {
    /* ignore non-JSON error bodies */
  }

  return jsonError(userMessage, 500);
}

export function GET() {
  return jsonError("Method not allowed", 405);
}
