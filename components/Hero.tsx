"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const headlineWords = "Your calendar, finally honest.".split(" ");

const WAVEFORM_ONLY_MS = 1500;
const TASK_TYPING_MS = 700;
const TASK_ANIMATE_MS = 300;
const TASK_AFTER_MS = 600;
const TASK_BLOCK_MS = TASK_TYPING_MS + TASK_ANIMATE_MS + TASK_AFTER_MS;
const HOLD_START_MS = WAVEFORM_ONLY_MS + 5 * TASK_BLOCK_MS;
const HOLD_MS = 2000;
const RESET_START_MS = HOLD_START_MS + HOLD_MS;
const RESET_ROW_STAGGER_MS = 150;
const RESET_ROW_FADE_MS = 400;
const RESET_PAUSE_MS = 2000;
const CYCLE_MS = RESET_START_MS + 5 * RESET_ROW_STAGGER_MS + RESET_ROW_FADE_MS + RESET_PAUSE_MS;

const TYPING_MS_PER_CHAR = 40;

const PHONE_TASKS = [
  { label: "9:00 — Review Bio", meta: "Mon · 90 min", tag: "FOCUS", accent: "#2D6B47" },
  { label: "10:30 — Chem report", meta: "Tue · 2 hrs", tag: "FOCUS", accent: "#2D6B47" },
  { label: "2:00 — Gym", meta: "Wed · 1 hr", tag: "HEALTH", accent: "#5C8A52" },
  { label: "4:00 — Café catch-up", meta: "Thu · 45 min", tag: "LEISURE", accent: "#D4A040" },
  { label: "6:30 — Reply to emails", meta: "Fri · 30 min", tag: "ADMIN", accent: "#888888" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 px-5 md:px-8 overflow-hidden grain">
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6">
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
          <motion.p
            className="mt-8 max-w-[480px] font-body text-lg text-foreground/85 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            CalSpaces listens to how you actually work — then builds a schedule around your real life, not the one you wish you had.
          </motion.p>
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

function PhoneScreenContent() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

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

  const isWaveformOnly = elapsed < WAVEFORM_ONLY_MS;
  const isHold = elapsed >= HOLD_START_MS && elapsed < RESET_START_MS;
  const isReset = elapsed >= RESET_START_MS;

  const blockProgress = elapsed >= WAVEFORM_ONLY_MS ? (elapsed - WAVEFORM_ONLY_MS) % TASK_BLOCK_MS : 0;
  const rawTypingIndex = elapsed >= WAVEFORM_ONLY_MS && elapsed < HOLD_START_MS ? Math.floor((elapsed - WAVEFORM_ONLY_MS) / TASK_BLOCK_MS) : -1;
  const isInTypingWindow = blockProgress < TASK_TYPING_MS;
  const currentTypingTaskIndex = rawTypingIndex >= 0 && rawTypingIndex < 5 && isInTypingWindow ? rawTypingIndex : -1;

  const taskTypingStartMs = WAVEFORM_ONLY_MS + rawTypingIndex * TASK_BLOCK_MS;
  const typedChars =
    currentTypingTaskIndex >= 0 && currentTypingTaskIndex < PHONE_TASKS.length
      ? Math.min(
          PHONE_TASKS[currentTypingTaskIndex].label.length,
          Math.floor((elapsed - taskTypingStartMs) / TYPING_MS_PER_CHAR)
        )
      : 0;

  const taskAppearTime = (i: number) => WAVEFORM_ONLY_MS + TASK_TYPING_MS + i * TASK_BLOCK_MS;
  const visibleTaskCount =
    elapsed >= HOLD_START_MS
      ? 5
      : PHONE_TASKS.filter((_, i) => elapsed >= taskAppearTime(i)).length;

  const showCheckmark =
    elapsed >= WAVEFORM_ONLY_MS &&
    elapsed < HOLD_START_MS &&
    blockProgress >= TASK_TYPING_MS &&
    blockProgress < TASK_TYPING_MS + 400;

  const waveformOpacity = isWaveformOnly
    ? 1
    : isReset
      ? 0.4 + 0.6 * Math.min(1, (elapsed - RESET_START_MS) / 600)
      : 0.4;

  const showScheduleReady = isHold && elapsed >= HOLD_START_MS + 400;

  const rowOpacity = (i: number) => {
    if (!isReset) return 1;
    const rowFadeStart = RESET_START_MS + i * RESET_ROW_STAGGER_MS;
    const rowFadeEnd = rowFadeStart + RESET_ROW_FADE_MS;
    if (elapsed < rowFadeStart) return 1;
    if (elapsed >= rowFadeEnd) return 0;
    return 1 - (elapsed - rowFadeStart) / RESET_ROW_FADE_MS;
  };

  const scheduleReadyFadeStart = RESET_START_MS + 5 * RESET_ROW_STAGGER_MS;
  const scheduleReadyOpacity = isReset
    ? elapsed < scheduleReadyFadeStart
      ? 1
      : Math.max(0, 1 - (elapsed - scheduleReadyFadeStart) / RESET_ROW_FADE_MS)
    : showScheduleReady
      ? 1
      : 0;

  const zone2Text =
    currentTypingTaskIndex < 0
      ? ""
      : showCheckmark
        ? ""
        : PHONE_TASKS[currentTypingTaskIndex].label.slice(0, typedChars);

  const showCursor =
    isWaveformOnly ||
    (currentTypingTaskIndex >= 0 &&
      !showCheckmark &&
      typedChars < PHONE_TASKS[currentTypingTaskIndex].label.length);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Zone 1 — Task list 60% */}
      <div className="flex-[0.6] min-h-0 flex flex-col overflow-hidden px-4 py-3.5" style={{ padding: "14px 16px" }}>
        <div className="flex items-center justify-between shrink-0 mb-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            YOUR WEEK
          </span>
          <span className="font-mono text-[10px] text-white/35">···</span>
        </div>
        <div className="flex-1 min-h-0 overflow-auto flex flex-col gap-2.5" style={{ gap: 10 }}>
          {PHONE_TASKS.slice(0, visibleTaskCount).map((task, i) => (
            <motion.div
              key={task.label}
              className="flex items-center gap-2 border-b border-white/5"
              style={{
                minHeight: 52,
                padding: "10px 0",
                gap: 10,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: rowOpacity(i), y: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
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
          {visibleTaskCount >= 5 && (showScheduleReady || isReset) && (
            <motion.p
              className="font-mono mt-2"
              style={{
                fontSize: 10,
                color: "#4CAF80",
                opacity: scheduleReadyOpacity,
              }}
              initial={false}
              transition={{ duration: 0.4 }}
            >
              Schedule ready ✓
            </motion.p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px shrink-0 bg-white/[0.12]" />

      {/* Zone 2 — Voice input 40% */}
      <div className="flex-[0.4] min-h-0 flex flex-col" style={{ padding: "14px 16px" }}>
        <div
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40 mb-2 shrink-0"
        >
          Voice dump
        </div>
        <motion.div
          className="flex items-end w-full mb-2 shrink-0"
          style={{ opacity: waveformOpacity, minHeight: 32 }}
          transition={{ duration: 0.2 }}
        >
          <Waveform />
        </motion.div>
        <div
          className="font-mono text-white/80 min-h-[2.5rem] flex items-center flex-wrap"
          style={{ fontSize: 12 }}
        >
          {zone2Text}
          {showCursor && (
            <span className="animate-cursor-blink inline-block ml-0.5 text-white/80">
              ▋
            </span>
          )}
          <AnimatePresence mode="wait">
            {showCheckmark && (
              <motion.span
                key="added"
                className="font-semibold"
                style={{ color: "#4CAF80", fontSize: 11 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                ✓ added
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Waveform() {
  const ratios = [0.3, 0.6, 0.45, 0.8, 0.5, 0.7, 0.4, 0.65, 0.55, 0.75, 0.5, 0.6];
  const minH = 8;
  const maxH = 32;
  const toPx = (r: number) => minH + (maxH - minH) * r;
  return (
    <div
      className="flex items-end w-full"
      style={{ height: maxH, gap: 3 }}
    >
      {ratios.map((r, idx) => (
        <motion.div
          key={idx}
          className="rounded-full shrink-0"
          style={{
            width: 3,
            backgroundColor: "#D4A040",
          }}
          animate={{
            height: [
              `${toPx(r)}px`,
              `${toPx(ratios[(idx + 1) % ratios.length])}px`,
              `${toPx(r)}px`,
            ],
          }}
          transition={{ duration: 0.8, repeat: Infinity, delay: idx * 0.05 }}
        />
      ))}
    </div>
  );
}
