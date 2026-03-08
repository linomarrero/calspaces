"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const headlineWords = "Your calendar, finally honest.".split(" ");

// ── Timing constants ──────────────────────────────────────────
const WAVEFORM_ONLY_MS = 1500;        // waveform plays alone before anything starts

// Transcript types continuously at this speed
const MS_PER_CHAR = 18;

// Tasks appear independently on their own schedule
const FIRST_TASK_DELAY_MS = 1200;     // extra pause after typing begins before first task
const TASK_INTERVAL_MS = 2800;        // time between each task appearing

// Derived: when do all 5 tasks finish appearing?
const ALL_TASKS_DONE_MS =
  WAVEFORM_ONLY_MS + FIRST_TASK_DELAY_MS + 4 * TASK_INTERVAL_MS + 500;

const HOLD_MS = 3000;                 // hold everything visible
const RESET_START_MS = ALL_TASKS_DONE_MS + HOLD_MS;
const RESET_ROW_STAGGER_MS = 150;
const RESET_ROW_FADE_MS = 400;
const RESET_PAUSE_MS = 1500;
const CYCLE_MS =
  RESET_START_MS +
  5 * RESET_ROW_STAGGER_MS +
  RESET_ROW_FADE_MS +
  RESET_PAUSE_MS;

// ── Data ──────────────────────────────────────────────────────
const TRANSCRIPT_LINES = [
  "okay so i have a bio exam monday morning, need like an hour and a half to review...",
  "and a chem lab report due tuesday, that's probably two hours...",
  "i want to hit the gym wednesday morning too, just an hour",
  "oh and café catch-up with Sara thursday afternoon, maybe 45 minutes",
  "and i really need to reply to those emails friday morning, half an hour tops",
];

const PHONE_TASKS = [
  { label: "9:00 — Review Bio",      meta: "Mon · 90 min", tag: "FOCUS",   accent: "#2D6B47" },
  { label: "10:30 — Chem report",    meta: "Tue · 2 hrs",  tag: "FOCUS",   accent: "#2D6B47" },
  { label: "2:00 — Gym",             meta: "Wed · 1 hr",   tag: "HEALTH",  accent: "#5C8A52" },
  { label: "4:00 — Café catch-up",   meta: "Thu · 45 min", tag: "LEISURE", accent: "#D4A040" },
  { label: "6:30 — Reply to emails", meta: "Fri · 30 min", tag: "ADMIN",   accent: "#888888" },
];

// ── Hero ──────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 px-5 md:px-8 overflow-hidden grain">
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* Left column */}
        <div className="lg:col-span-6">
          {/* Beta badge */}
          <motion.div
            className="inline-flex items-center gap-2 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <span
              className="font-mono text-[10px] uppercase tracking-[0.15em] px-2 py-1 rounded-[2px] border"
              style={{ color: "#1A3C2B", borderColor: "#1A3C2B" }}
            >
              Now in Beta
            </span>
          </motion.div>

          {/* Thin rule */}
          <motion.div
            className="mb-5 h-px"
            style={{ width: 48, backgroundColor: "rgba(26,60,43,0.2)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          />

          {/* Headline */}
          <motion.h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold text-near-black leading-[1.05] tracking-tight"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.06 } },
              hidden: {},
            }}
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em]"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-8 max-w-[480px] font-body text-lg text-foreground/85 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            CalSpaces listens to how you actually work — then builds a schedule
            around your real life, not the one you wish you had.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            <Link
              href="#waitlist"
              className="inline-block bg-accent text-white font-body text-sm font-medium px-6 py-3 rounded-sharp hover:opacity-90 transition-opacity"
            >
              Join the Waitlist
            </Link>
            <a
              href="#demo"
              className="font-body text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              See it in action ↓
            </a>
          </motion.div>
        </div>

        {/* Right column — phone */}
        <motion.div
          className="lg:col-span-6 flex justify-center lg:justify-end relative"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="relative w-[280px] sm:w-[320px]">
            <div className="aspect-[9/19] rounded-[28px] bg-near-black/95 shadow-2xl border border-foreground/10 overflow-hidden">
              <div className="h-full flex flex-col bg-[#1A1A18]">
                <PhoneScreenContent />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ── Phone screen ──────────────────────────────────────────────
function PhoneScreenContent() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const prevTotalCharsRef = useRef(0);

  // Main animation loop
  useEffect(() => {
    startRef.current = performance.now();
    let lastSet = 0;
    const tick = (now: number) => {
      let e = Math.floor(now - startRef.current);
      if (e >= CYCLE_MS) {
        startRef.current = now;
        e = 0;
      }
      if (now - lastSet > 40) {
        lastSet = now;
        setElapsed(e);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Phase flags ──
  const isWaveformOnly = elapsed < WAVEFORM_ONLY_MS;
  const isHold = elapsed >= ALL_TASKS_DONE_MS && elapsed < RESET_START_MS;
  const isReset = elapsed >= RESET_START_MS;

  // ── Transcript: continuous typing, decoupled from tasks ──
  const transcriptElapsed = Math.max(0, elapsed - WAVEFORM_ONLY_MS);
  const totalCharsTyped = Math.floor(transcriptElapsed / MS_PER_CHAR);

  const transcriptCharsForLine = (i: number): number => {
    const charsBeforeThisLine = TRANSCRIPT_LINES.slice(0, i).reduce(
      (sum, l) => sum + l.length,
      0
    );
    return Math.max(
      0,
      Math.min(TRANSCRIPT_LINES[i].length, totalCharsTyped - charsBeforeThisLine)
    );
  };

  // Which line is currently being typed (for cursor blink)
  const currentTypingLine = (() => {
    let cumulative = 0;
    for (let i = 0; i < TRANSCRIPT_LINES.length; i++) {
      cumulative += TRANSCRIPT_LINES[i].length;
      if (totalCharsTyped < cumulative) return i;
    }
    return -1; // all done
  })();

  const isActivelyTyping = currentTypingLine >= 0 && !isHold && !isReset;

  // ── Tasks: independent schedule ──
  const taskAppearTime = (i: number) =>
    WAVEFORM_ONLY_MS + FIRST_TASK_DELAY_MS + i * TASK_INTERVAL_MS;

  const visibleTaskCount = isReset || isHold
    ? 5
    : PHONE_TASKS.filter((_, i) => elapsed >= taskAppearTime(i)).length;

  // Row fade-out during reset
  const rowOpacity = (i: number): number => {
    if (!isReset) return 1;
    const start = RESET_START_MS + i * RESET_ROW_STAGGER_MS;
    const end = start + RESET_ROW_FADE_MS;
    if (elapsed < start) return 1;
    if (elapsed >= end) return 0;
    return 1 - (elapsed - start) / RESET_ROW_FADE_MS;
  };

  const showScheduleReady = isHold && elapsed >= ALL_TASKS_DONE_MS + 400;
  const scheduleReadyFadeStart = RESET_START_MS + 5 * RESET_ROW_STAGGER_MS;
  const scheduleReadyOpacity = isReset
    ? Math.max(0, 1 - (elapsed - scheduleReadyFadeStart) / RESET_ROW_FADE_MS)
    : showScheduleReady
    ? 1
    : 0;

  // Waveform opacity: full while typing, dims during hold/reset
  const waveformOpacity = isWaveformOnly
    ? 1
    : isReset
    ? 0.4 + 0.6 * Math.min(1, (elapsed - RESET_START_MS) / 600)
    : isHold
    ? 0.25
    : 0.7;

  // Transcript area opacity
  const transcriptOpacity = isReset
    ? Math.max(0, 1 - (elapsed - RESET_START_MS) / RESET_ROW_FADE_MS)
    : isHold
    ? 0.3
    : 1;

  // Auto-scroll transcript — scroll only within the container, never the page
  const totalCharsVisible = TRANSCRIPT_LINES.reduce(
    (sum, _, i) => sum + transcriptCharsForLine(i),
    0
  );
  useEffect(() => {
    if (totalCharsVisible > prevTotalCharsRef.current) {
      prevTotalCharsRef.current = totalCharsVisible;
      const el = transcriptContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
    if (elapsed < 100) prevTotalCharsRef.current = 0;
  }, [totalCharsVisible, elapsed]);

  return (
    <div className="flex-1 min-h-0 flex flex-col">

      {/* ── Zone 1: Task list (60%) ── */}
      <div
        className="flex-[0.6] min-h-0 flex flex-col overflow-hidden"
        style={{ padding: "14px 16px" }}
      >
        <div className="flex items-center justify-between shrink-0 mb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            Your Week
          </span>
          <span className="font-mono text-[10px] text-white/35">···</span>
        </div>

        <div className="flex-1 min-h-0 overflow-auto flex flex-col" style={{ gap: 10 }}>
          {PHONE_TASKS.slice(0, visibleTaskCount).map((task, i) => (
            <motion.div
              key={task.label}
              className="flex items-center border-b border-white/5"
              style={{ minHeight: 52, padding: "10px 0", gap: 10 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: rowOpacity(i), y: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Accent bar */}
              <motion.div
                className="shrink-0 self-stretch rounded-sm"
                style={{
                  width: 4,
                  backgroundColor: task.accent,
                  transformOrigin: "top",
                  minHeight: 36,
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.25 }}
              />
              {/* Text */}
              <div className="min-w-0 flex-1">
                <p
                  className="font-body font-semibold truncate"
                  style={{ fontSize: 14, color: "rgba(255,255,255,0.92)" }}
                >
                  {task.label}
                </p>
                <p className="font-mono text-white/50 mt-0.5" style={{ fontSize: 11 }}>
                  {task.meta}
                </p>
              </div>
              {/* Tag pill */}
              <span
                className="font-mono uppercase shrink-0 border rounded-[2px]"
                style={{
                  fontSize: 10,
                  padding: "3px 7px",
                  borderWidth: 1,
                  borderColor: task.accent,
                  color: task.accent,
                }}
              >
                {task.tag}
              </span>
            </motion.div>
          ))}

          {/* Schedule ready */}
          {visibleTaskCount >= 5 && (showScheduleReady || isReset) && (
            <motion.p
              className="font-mono mt-2"
              style={{ fontSize: 10, color: "#4CAF80", opacity: scheduleReadyOpacity }}
              initial={false}
              transition={{ duration: 0.4 }}
            >
              Schedule ready ✓
            </motion.p>
          )}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px shrink-0 bg-white/[0.12]" />

      {/* ── Zone 2: Voice dump (40%) ── */}
      <div
        className="flex-[0.4] min-h-0 flex flex-col"
        style={{ padding: "14px 16px" }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 mb-2 shrink-0">
          Voice Dump
        </div>

        {/* Waveform */}
        <motion.div
          className="flex items-end w-full mb-2 shrink-0"
          style={{ opacity: waveformOpacity, minHeight: 32 }}
          transition={{ duration: 0.4 }}
        >
          <Waveform active={isActivelyTyping} />
        </motion.div>

        {/* Transcript */}
        <div
          ref={transcriptContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
          style={{ opacity: transcriptOpacity, transition: "opacity 0.4s" }}
        >
          <div
            className="font-mono text-white/55"
            style={{ fontSize: 10, lineHeight: 1.6 }}
          >
            {TRANSCRIPT_LINES.map((line, i) => {
              const chars = transcriptCharsForLine(i);
              if (chars === 0) return null;
              const text = line.slice(0, chars);
              const isCurrentLine = i === currentTypingLine;
              return (
                <div key={i} className="mb-0.5">
                  {text}
                  {isCurrentLine && (
                    <span
                      className="animate-cursor-blink inline-block ml-0.5 align-baseline"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      ▋
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Waveform ──────────────────────────────────────────────────
function Waveform({ active = false }: { active?: boolean }) {
  const ratios = [0.3, 0.6, 0.45, 0.8, 0.5, 0.7, 0.4, 0.65, 0.55, 0.75, 0.5, 0.6];
  const minH = 8;
  const maxH = 32;
  const amplitude = active ? 1.25 : 0.8;
  const toPx = (r: number) => minH + (maxH - minH) * Math.min(1, r * amplitude);
  const duration = active ? 0.45 : 0.9;
  const delay = active ? 0.02 : 0.06;

  return (
    <div className="flex items-end w-full" style={{ height: maxH, gap: 3 }}>
      {ratios.map((r, idx) => (
        <motion.div
          key={idx}
          className="rounded-full shrink-0"
          style={{ width: 3, backgroundColor: "#D4A040" }}
          animate={{
            height: [
              `${toPx(r)}px`,
              `${toPx(ratios[(idx + 1) % ratios.length])}px`,
              `${toPx(r)}px`,
            ],
          }}
          transition={{ duration, repeat: Infinity, delay: idx * delay }}
        />
      ))}
    </div>
  );
}
