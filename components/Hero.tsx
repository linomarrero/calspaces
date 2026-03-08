"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const headlineWords = "Your calendar, finally honest.".split(" ");

const CYCLE_MS = 8100;
const RECORDING_MS = 1500;
const PROCESSING_MS = 800;
const TASKS_START_MS = 2300;
const TASK_STAGGER_MS = 700;
const HOLD_START_MS = 5500;
const RESET_START_MS = 7500;
const RESET_MS = 600;

const PHONE_TASKS = [
  { label: "9:00 — Review Bio", meta: "Mon · 90 min", accent: "#1A3C2B" },
  { label: "10:30 — Chem report", meta: "Tue · 2 hrs", accent: "#1A3C2B" },
  { label: "2:00 — Gym", meta: "Wed · 1 hr", accent: "#C8962A" },
  { label: "4:00 — Café catch-up", meta: "Thu · 45 min", accent: "#7A8B7A" },
  { label: "6:30 — Reply to emails", meta: "Fri · 30 min", accent: "#6B7280" },
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
              <div className="p-5 h-full flex flex-col">
                <div className="font-mono text-[10px] text-white/60 uppercase tracking-wider mb-3">
                  Voice dump
                </div>
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
      if (now - lastSet > 50) {
        lastSet = now;
        setElapsed(e);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const isRecording = elapsed < RECORDING_MS;
  const isProcessing = elapsed >= RECORDING_MS && elapsed < TASKS_START_MS;
  const isTasks = elapsed >= TASKS_START_MS && elapsed < HOLD_START_MS;
  const isHold = elapsed >= HOLD_START_MS && elapsed < RESET_START_MS;
  const isReset = elapsed >= RESET_START_MS;

  const waveformOpacity = isRecording ? 1 : isProcessing ? 1 - (elapsed - RECORDING_MS) / PROCESSING_MS : isReset ? Math.min(1, (elapsed - RESET_START_MS) / RESET_MS) : 0;
  const listOpacity = isReset ? Math.max(0, 1 - (elapsed - RESET_START_MS) / RESET_MS) : isTasks || isHold ? 1 : 0;

  const visibleTaskCount = isTasks || isHold
    ? Math.min(5, Math.floor((elapsed - TASKS_START_MS) / TASK_STAGGER_MS) + 1)
    : 0;
  const showScheduleSaved = isHold && elapsed >= HOLD_START_MS + 400;

  return (
    <>
      <div className="flex-1 min-h-0 rounded-lg bg-white/5 border border-white/10 p-3 flex flex-col justify-end overflow-hidden">
        <motion.div
          className="flex items-end w-full"
          style={{ opacity: waveformOpacity, minHeight: 32 }}
          transition={{ duration: 0.2 }}
        >
          <Waveform />
        </motion.div>

        <AnimatePresence mode="wait">
          {isRecording && (
            <motion.p
              key="listening"
              className="font-mono text-[10px] text-white/50 mt-2 animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Listening...
            </motion.p>
          )}
          {isProcessing && (
            <motion.div
              key="organizing"
              className="mt-2 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-mono text-[10px] text-white/50">Organizing your week...</p>
              <div className="h-px bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-deep-forest rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="mt-4 min-h-0 overflow-hidden"
        style={{ opacity: listOpacity }}
        transition={{ duration: 0.25 }}
      >
        {visibleTaskCount > 0 && (
          <div className="space-y-0">
            {PHONE_TASKS.slice(0, visibleTaskCount).map((task) => (
              <motion.div
                key={task.label}
                className="flex items-center gap-2 py-1.5 px-2 border-b border-white/5 last:border-0"
                style={{ minHeight: 36 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div
                  className="w-0.5 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: task.accent, minHeight: 28 }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-body text-[12px] font-semibold text-white/90 truncate">
                    {task.label}
                  </p>
                  <p className="font-mono text-[10px] text-white/35">{task.meta}</p>
                </div>
              </motion.div>
            ))}
            {showScheduleSaved && (
              <motion.p
                className="font-mono text-[10px] text-emerald-400/90 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Schedule saved ✓
              </motion.p>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}

function Waveform() {
  const bars = [0.3, 0.6, 0.45, 0.8, 0.5, 0.7, 0.4, 0.65, 0.55, 0.75, 0.5, 0.6];
  return (
    <div className="flex items-end gap-0.5 h-8 w-full">
      {bars.map((h, idx) => (
        <motion.div
          key={idx}
          className="w-1 bg-amber/80 rounded-full"
          animate={{ height: [`${h * 100}%`, `${(bars[(idx + 1) % bars.length]) * 100}%`, `${h * 100}%`] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: idx * 0.05 }}
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}
