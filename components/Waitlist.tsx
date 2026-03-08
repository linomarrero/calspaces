"use client";

import { useState, useEffect } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => setCount(data.count ?? 0))
      .catch(() => setCount(0));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = await res.json();
    if (data.ok) {
      setStatus("success");
      setEmail("");
      setCount((c) => (c !== null ? c + 1 : null));
    } else {
      setStatus("error");
      setMessage(data.error ?? "Something went wrong.");
    }
  }

  return (
    <section id="waitlist" className="py-20 md:py-28 bg-linen">
      <div className="mx-auto max-w-xl px-5 md:px-8 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-semibold text-near-black">
          Get in early.
        </h2>
        <p className="mt-4 font-body text-foreground/80 text-lg">
          We&apos;re opening access in cohorts. Early members get 3 months free and direct input into what we build next.
        </p>

        {status === "success" ? (
          <p className="mt-10 font-body text-foreground text-lg">
            You&apos;re in. We&apos;ll be in touch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={status === "loading"}
                className="flex-1 min-w-0 px-4 py-3 font-body text-foreground bg-white border border-foreground/20 rounded-sharp focus:outline-none focus:border-accent placeholder:text-foreground/40"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 bg-accent text-white font-body text-sm font-medium rounded-sharp hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                Reserve my spot
              </button>
            </div>
            {status === "error" && (
              <p className="mt-2 font-body text-sm text-red-700">{message}</p>
            )}
            {count !== null && (
              <p className="mt-4 font-mono text-xs text-foreground/50">
                {count.toLocaleString()} people ahead of you.
              </p>
            )}
            <p className="mt-2 font-body text-xs text-amber-800/90">
              Cohort 1 is nearly full.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
