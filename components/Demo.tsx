"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SCENARIOS, scheduleFromTranscript, type DemoTask, type TaskCategory } from "@/lib/demoData";

const LINEN = "#F5F2EC";

const BLOCK_STYLES: Record<
  TaskCategory,
  { bg: string; border: string }
> = {
  FOCUS: { bg: "rgba(45,107,71,0.3)", border: "#2D6B47" },
  HEALTH: { bg: "rgba(92,138,82,0.3)", border: "#5C8A52" },
  LEISURE: { bg: "rgba(212,160,64,0.2)", border: "#D4A040" },
  ADMIN: { bg: "rgba(120,120,120,0.2)", border: "#888" },
  DEADLINE: { bg: "rgba(180,60,60,0.25)", border: "#B43C3C" },
};

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7);
const GRID_START = 7;
const GRID_END = 23;
const TOTAL_MINUTES = (GRID_END - GRID_START) * 60;
const PX_PER_HOUR = 60;
const PX_PER_MIN = PX_PER_HOUR / 60;

function timeToTop(start: string): number {
  const [h, m] = start.split(":").map(Number);
  return (h - GRID_START) * PX_PER_HOUR + m * PX_PER_MIN;
}

function durationPx(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh - sh) * PX_PER_HOUR + (em - sm) * PX_PER_MIN;
}

function formatDisplayDate(d: Date): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function getCurrentTimeMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export default function Demo() {
  const [transcript, setTranscript] = useState("");
  const [transcriptDisplay, setTranscriptDisplay] = useState("");
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<DemoTask[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(getCurrentTimeMinutes);
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreen) setFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreen]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTimeMinutes(getCurrentTimeMinutes()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const fillTranscriptWithTypewriter = useCallback((target: string, msPerChar = 12) => {
    if (typewriterRef.current) clearTimeout(typewriterRef.current);
    setTranscript(target);
    setTranscriptDisplay("");
    let i = 0;
    const run = () => {
      if (i <= target.length) {
        setTranscriptDisplay(target.slice(0, i));
        i++;
        typewriterRef.current = setTimeout(run, msPerChar);
      } else {
        typewriterRef.current = null;
      }
    };
    run();
  }, []);

  const selectScenario = useCallback((s: (typeof SCENARIOS)[0]) => {
    setActiveScenarioId(s.id);
    setTasks([]);
    setProcessed(false);
    fillTranscriptWithTypewriter(s.transcript, 12);
  }, [fillTranscriptWithTypewriter]);

  const process = useCallback(() => {
    const text = transcript.trim();
    if (!text) return;
    setProcessing(true);
    setProcessed(false);
    setTimeout(() => {
      const result = scheduleFromTranscript(text);
      setTasks(result);
      setCompleted(new Set());
      setProcessed(true);
      setProcessing(false);
    }, 800);
  }, [transcript]);

  const toggleComplete = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const statusMessage = !transcript.trim()
    ? "Add something to schedule first."
    : processing
      ? "Extracting tasks and resolving conflicts..."
      : processed
        ? `✓ Successfully scheduled ${tasks.length} tasks`
        : null;

  const calendarContent = (
    <div className="flex flex-col h-full min-h-[600px] bg-[#111109] rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/45">YOUR DAY</span>
        <span className="font-mono text-sm text-white/70">{formatDisplayDate(new Date())}</span>
        <button
          type="button"
          className="font-mono text-[11px] px-3 py-1.5 border border-white/40 rounded-sm text-white/80 hover:bg-white/5 transition-colors"
        >
          Sync to Calendar
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-auto relative" style={{ height: TOTAL_MINUTES * PX_PER_MIN + 40 }}>
        <div className="relative pr-4 pb-4" style={{ minHeight: TOTAL_MINUTES * PX_PER_MIN }}>
          {/* Time labels */}
          <div className="sticky top-0 left-0 z-10 flex font-mono text-[11px] text-white/30 bg-[#111109] pb-1">
            <div className="w-12 shrink-0" />
            <div className="flex-1" />
          </div>
          {HOURS.map((h) => (
            <div
              key={h}
              className="absolute left-0 right-0 font-mono text-[11px] text-white/30"
              style={{ top: (h - GRID_START) * PX_PER_HOUR + 24 }}
            >
              <span className="absolute left-0 w-10">{h}:00</span>
            </div>
          ))}
          {/* Grid lines */}
          {HOURS.map((h) => (
            <div
              key={`full-${h}`}
              className="absolute left-12 right-0 border-t border-white/[0.06]"
              style={{ top: (h - GRID_START) * PX_PER_HOUR + 24 }}
            />
          ))}
          {Array.from({ length: (GRID_END - GRID_START) * 2 - 1 }, (_, i) => i + 1).map((i) => {
            const min = GRID_START * 60 + i * 30;
            if (min >= GRID_END * 60) return null;
            const top = (min / 60 - GRID_START) * PX_PER_HOUR + 24;
            return (
              <div
                key={`half-${i}`}
                className="absolute left-12 right-0 border-t border-white/[0.03]"
                style={{ top }}
              />
            );
          })}
          {/* Current time indicator */}
          {currentTimeMinutes >= GRID_START * 60 && currentTimeMinutes < GRID_END * 60 && (
            <div
              className="absolute left-12 right-0 z-20 flex items-center pointer-events-none"
              style={{ top: (currentTimeMinutes / 60 - GRID_START) * PX_PER_HOUR + 24 }}
            >
              <div className="w-2 h-2 rounded-full bg-[#E05555] shrink-0 -ml-1" />
              <div className="flex-1 h-px bg-[#E05555]" />
            </div>
          )}
          {/* Empty state */}
          {tasks.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-12 text-white/40">
              <div className="font-mono text-xs mb-6">Your schedule will appear here.</div>
              <div className="w-full max-w-sm space-y-3 px-12">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-14 rounded-sm bg-white/5 animate-pulse"
                    style={{
                      width: `${60 + i * 15}%`,
                      marginLeft: `${i * 8}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Task blocks */}
          {tasks.map((task, i) => {
            const top = timeToTop(task.start) + 24;
            const height = durationPx(task.start, task.end);
            const style = BLOCK_STYLES[task.category];
            const isDone = completed.has(task.id);
            return (
              <motion.div
                key={task.id}
                className="absolute left-12 right-2 rounded-sm overflow-hidden border-l-[3px] cursor-pointer hover:brightness-110 transition-[filter]"
                style={{
                  top,
                  height: Math.max(28, height),
                  background: style.bg,
                  borderColor: style.border,
                  opacity: isDone ? 0.4 : 1,
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.12 }}
              >
                <div className="p-2 h-full flex flex-col text-left">
                  <div className="flex items-start justify-between gap-1">
                    <span
                      className="font-body text-[13px] font-semibold text-white/90 truncate flex-1"
                      style={isDone ? { textDecoration: "line-through" } : undefined}
                    >
                      {task.title}
                    </span>
                    <span
                      className="font-mono text-[9px] uppercase shrink-0 border rounded-[2px] px-1 py-0.5"
                      style={{ borderColor: style.border, color: style.border }}
                    >
                      {task.category}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-white/50 mt-0.5">
                    {task.start} – {task.end} · {task.estimatedMinutes}m
                  </span>
                  <div className="mt-auto pt-1 flex justify-end">
                    <label
                      className="flex items-center gap-1 font-mono text-[9px] text-white/60 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleComplete(task.id)}
                        className="rounded border-white/40"
                      />
                      Done
                    </label>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const mainContent = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Left panel */}
      <div className="lg:col-span-5 max-w-[480px] lg:max-w-none space-y-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-2">
            Live demo
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-near-black">
            See it think.
          </h2>
          <p className="mt-2 font-body text-foreground/80">
            Pick a scenario. Watch CalSpaces build a real schedule.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => selectScenario(s)}
              className={`font-body text-sm px-4 py-2 rounded-[2px] border transition-colors ${
                activeScenarioId === s.id
                  ? "bg-[#1A3C2B] text-white border-[#1A3C2B]"
                  : "bg-transparent border-near-black/30 text-near-black hover:border-near-black/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 block mb-1.5">
            BRAIN DUMP TRANSCRIPT
          </label>
          <textarea
            value={transcriptDisplay}
            onChange={(e) => {
              const v = e.target.value;
              setTranscriptDisplay(v);
              setTranscript(v);
              setProcessed(false);
            }}
            rows={8}
            placeholder="Just talk. Drop everything here — deadlines, errands, appointments, things you've been putting off. Don't organize it, that's our job."
            className="w-full font-mono text-[13px] bg-[#F5F2EC] border border-near-black/20 rounded-[2px] p-3 resize-y focus:outline-none focus:border-near-black/40 placeholder:text-foreground/40"
            spellCheck={false}
          />
        </div>

        <button
          type="button"
          onClick={process}
          disabled={processing || !transcript.trim()}
          className="w-full font-body text-sm font-medium bg-[#1A3C2B] text-white py-3 rounded-sharp hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {processing ? (
            <span className="inline-flex items-center">
              Scheduling
              <span className="inline-block w-3 text-left animate-pulse">...</span>
            </span>
          ) : (
            "Process this →"
          )}
        </button>

        {statusMessage && (
          <p
            className={`font-mono text-[11px] ${
              !transcript.trim()
                ? "text-red-600/80"
                : processed
                  ? "text-[#2D6B47]"
                  : "text-foreground/50"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>

      {/* Right panel */}
      <div className="lg:col-span-7 min-h-[600px]">{calendarContent}</div>
    </div>
  );

  return (
    <section id="demo" className="py-20 md:py-28 relative" style={{ background: LINEN }}>
      <button
        type="button"
        onClick={() => setFullscreen(true)}
        className="absolute top-8 right-5 md:right-8 font-mono text-xs text-foreground/60 hover:text-foreground transition-colors"
      >
        Present fullscreen
      </button>

      <div className="mx-auto max-w-7xl px-5 md:px-8">{mainContent}</div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111109] flex flex-col"
          >
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white font-mono text-xl"
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex-1 overflow-auto p-6">{calendarContent}</div>
            <div className="absolute bottom-4 right-4 font-mono text-[10px] text-white/30">
              CalSpaces
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
