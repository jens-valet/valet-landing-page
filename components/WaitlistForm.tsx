"use client";

import { FormEvent, useId, useRef, useState } from "react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function WaitlistForm() {
  const emailId = useId();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          website: String(honeypotRef.current?.value ?? ""),
        }),
      });

      const data: unknown = await res.json().catch(() => ({}));
      const errMsg =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof (data as { error: unknown }).error === "string"
          ? (data as { error: string }).error
          : "Something went wrong";

      if (!res.ok) {
        setStatus("error");
        setMessage(errMsg);
        return;
      }

      setStatus("success");
      setMessage("You're on the list. We'll be in touch.");
      setEmail("");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form className="waitlist-form" onSubmit={onSubmit} noValidate>
      <div className="waitlist-honeypot" aria-hidden="true">
        <label htmlFor={`${emailId}-hp`}>Company website</label>
        <input
          ref={honeypotRef}
          id={`${emailId}-hp`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="waitlist-stack">
        <label htmlFor={emailId} className="waitlist-sr-only">
          Email for waitlist
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className={`waitlist-control${status === "error" ? " waitlist-control--error" : ""}`}
          placeholder="you@email.com"
          value={email}
          onChange={(ev) => {
            setEmail(ev.target.value);
            if (status !== "idle" && status !== "loading") {
              setStatus("idle");
              setMessage("");
            }
          }}
          required
          disabled={status === "loading"}
          aria-invalid={status === "error"}
          aria-describedby={message ? `${emailId}-msg` : undefined}
        />
        <button
          type="submit"
          className="waitlist-control waitlist-control--submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining…" : "Join Waitlist"}
        </button>
      </div>
      {message ? (
        <p
          id={`${emailId}-msg`}
          className={`waitlist-message waitlist-message--${status}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
