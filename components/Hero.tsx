"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const headlineWords = "Your calendar, finally honest.".split(" ");

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
                <div className="flex-1 min-h-0 rounded-lg bg-white/5 border border-white/10 p-3 flex items-end">
                  <Waveform />
                </div>
                <div className="mt-4 space-y-2">
                  {["9:00 Review Bio", "10:30 Chem report", "2:00 Gym", "4:00 Café"].map((line, i) => (
                    <div
                      key={i}
                      className="font-mono text-xs text-white/80 py-1 border-b border-white/5 last:border-0"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Waveform() {
  const bars = [0.3, 0.6, 0.45, 0.8, 0.5, 0.7, 0.4, 0.65, 0.55, 0.75, 0.5, 0.6];
  return (
    <div className="flex items-end gap-0.5 h-8 w-full">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-1 bg-amber/80 rounded-full"
          animate={{ height: [`${h * 100}%`, `${(bars[(i + 1) % bars.length]) * 100}%`, `${h * 100}%`] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}
