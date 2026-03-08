"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SCENARIOS,
  mockScheduleFromTranscript,
  type DemoTask,
  type TaskCategory,
} from "@/lib/demoData";

const CATEGORY_STYLES: Record<
  TaskCategory,
  { bg: string; border: string; text: string }
> = {
  urgent: { bg: "bg-red-950/30", border: "border-red-800/50", text: "text-red-200" },
  work: { bg: "bg-blue-950/30", border: "border-blue-800/50", text: "text-blue-200" },
  personal: { bg: "bg-emerald-950/30", border: "border-emerald-800/50", text: "text-emerald-200" },
  admin: { bg: "bg-zinc-700/30", border: "border-zinc-600/50", text: "text-zinc-300" },
};

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am–8pm
const TOTAL_MINUTES = 14 * 60;
const CALENDAR_HEIGHT = 420;
const PX_PER_MIN = CALENDAR_HEIGHT / TOTAL_MINUTES;

function timeToOffset(start: string): number {
  const [h, m] = start.split(":").map(Number);
  return ((h - 7) * 60 + m) * PX_PER_MIN;
}

function durationPx(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const min = (eh - sh) * 60 + (em - sm);
  return Math.max(28, min * PX_PER_MIN);
}

export default function Demo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState(SCENARIOS[0].transcript);
  const [tasks, setTasks] = useState<DemoTask[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [fullscreen, setFullscreen] = useState(false);

  const process = useCallback(() => {
    const result = mockScheduleFromTranscript(transcript);
    setTasks(result);
    setCompleted(new Set());
  }, [transcript]);

  const toggleComplete = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const content = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-5 space-y-6">
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
              onClick={() => {
                setTranscript(s.transcript);
                setTasks([]);
              }}
              className={`font-body text-sm px-4 py-2 rounded-sharp border transition-colors ${
                transcript === s.transcript
                  ? "bg-accent text-white border-accent"
                  : "bg-surface border-foreground/20 hover:border-foreground/40 text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="rounded-sharp border border-foreground/15 bg-surface/50 overflow-hidden">
          <div className="font-mono text-[10px] uppercase tracking-wider text-foreground/50 px-3 py-2 border-b border-foreground/10">
            Brain dump transcript
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full h-48 font-mono text-sm text-foreground bg-transparent p-3 resize-none focus:outline-none"
            placeholder="Paste or type a brain dump..."
            spellCheck={false}
          />
        </div>

        <button
          type="button"
          onClick={process}
          className="w-full font-body text-sm font-medium bg-accent text-white py-3 rounded-sharp hover:opacity-90 transition-opacity"
        >
          Process this →
        </button>
      </div>

      <div className="lg:col-span-7">
        <div className="rounded-sharp border border-foreground/15 bg-near-black/95 overflow-hidden min-h-[400px]">
          <div className="font-mono text-[10px] uppercase tracking-wider text-white/50 px-4 py-2 border-b border-white/10">
            Your day
          </div>
          <div className="p-4">
            <CalendarView
              tasks={tasks}
              completed={completed}
              onTaskClick={setSelectedId}
              onToggleComplete={toggleComplete}
            />
          </div>
        </div>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selectedId && (
              <TaskPopover
                task={tasks.find((t) => t.id === selectedId)}
                onClose={() => setSelectedId(null)}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );

  return (
    <section id="demo" className="py-20 md:py-28 bg-linen relative">
      <button
        type="button"
        onClick={() => setFullscreen(true)}
        className="absolute top-8 right-5 md:right-8 font-mono text-xs text-foreground/60 hover:text-foreground transition-colors"
      >
        Present fullscreen
      </button>

      <div className="mx-auto max-w-7xl px-5 md:px-8">{content}</div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-linen p-6 overflow-auto"
          >
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="fixed top-4 right-4 font-mono text-sm text-foreground/70 hover:text-foreground z-10"
            >
              Close
            </button>
            <div className="max-w-7xl mx-auto pt-12">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CalendarView({
  tasks,
  completed,
  onTaskClick,
  onToggleComplete,
}: {
  tasks: DemoTask[];
  completed: Set<string>;
  onTaskClick: (id: string) => void;
  onToggleComplete: (id: string) => void;
}) {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/40 font-body text-sm">
        Process a scenario to see your schedule.
      </div>
    );
  }

  return (
    <div className="relative" style={{ height: CALENDAR_HEIGHT }}>
      {/* Hour lines */}
      {HOURS.map((h) => (
        <div
          key={h}
          className="absolute left-0 right-0 border-t border-white/10 font-mono text-[10px] text-white/40"
          style={{ top: (h - 7) * 60 * PX_PER_MIN }}
        >
          <span className="absolute -top-2.5 left-0">{h}:00</span>
        </div>
      ))}

      {/* Task blocks */}
      {tasks.map((task, i) => {
        const top = timeToOffset(task.start);
        const style = CATEGORY_STYLES[task.category];
        return (
          <motion.button
            key={task.id}
            type="button"
            className={`absolute left-12 right-0 rounded-sm border px-2 py-1 text-left ${style.bg} ${style.border} ${style.text} hover:ring-1 hover:ring-white/30 transition-shadow ${
              completed.has(task.id) ? "opacity-60 line-through" : ""
            }`}
            style={{
              top,
              minHeight: durationPx(task.start, task.end),
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onTaskClick(task.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-body text-xs font-medium truncate">{task.title}</span>
              <label
                className="flex items-center gap-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={completed.has(task.id)}
                  onChange={() => onToggleComplete(task.id)}
                  className="rounded border-white/30"
                />
                <span className="font-mono text-[10px]">Done</span>
              </label>
            </div>
            <div className="font-mono text-[10px] text-white/60 mt-0.5">
              {task.start} – {task.end} · {task.estimatedMinutes}m
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function TaskPopover({
  task,
  onClose,
}: {
  task: DemoTask | undefined;
  onClose: () => void;
}) {
  if (!task) return null;

  const style = CATEGORY_STYLES[task.category];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <motion.div
        className={`rounded-sharp border p-4 max-w-sm w-full shadow-xl ${style.bg} ${style.border} ${style.text}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="font-display text-lg font-semibold">{task.title}</h4>
        <dl className="mt-3 font-mono text-xs space-y-1 text-white/80">
          <div>
            <dt className="text-white/50">Time</dt>
            <dd>{task.start} – {task.end} ({task.estimatedMinutes} min)</dd>
          </div>
          {task.urgencyReason && (
            <div>
              <dt className="text-white/50">Why here</dt>
              <dd>{task.urgencyReason}</dd>
            </div>
          )}
        </dl>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 font-body text-sm text-white/80 hover:text-white"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
