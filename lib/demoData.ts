export type TaskCategory = "FOCUS" | "HEALTH" | "LEISURE" | "ADMIN" | "DEADLINE";

export interface DemoTask {
  id: string;
  title: string;
  start: string;
  end: string;
  category: TaskCategory;
  estimatedMinutes: number;
}

export interface Scenario {
  id: string;
  label: string;
  transcript: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "college",
    label: "College student — midterms week",
    transcript: `Okay so. Bio exam coming up, have to review chapters 4 through 7 — need like 2 hours for that. Chem lab report is due soon, probably another 2 hours. I work a café shift from 4 to 8. Gym in the morning, I usually go around 7. Need to call my mom at some point. Laundry. Oh and I have a study group at 7pm. And I keep forgetting to renew my prescription — need to do that in the afternoon.`,
  },
  {
    id: "freelancer",
    label: "Freelancer — project crunch",
    transcript: `Client deliverable due EOD, that's the big one. Two rounds of revisions left. Got a client call at 2pm. Need to block focus time for the actual design work — probably a four-hour block in the morning. Coffee with the referral guy at 10am. Invoice the other client before end of day. And I need to actually sleep — last week I was up till 2 every night. So no work after 10pm.`,
  },
  {
    id: "parent",
    label: "Working parent — busy day",
    transcript: `Kids have soccer at 4:30, I'm driving so I need to leave by 4. Meeting at 9 that might run over — put a buffer after. Dentist at 2pm, already booked. Need to finish the Q3 deck, probably 2 hours of work. Grocery run has to happen, maybe right after dentist. Pick up dry cleaning at some point. And I want to get a workout in early before everything starts.`,
  },
];

// ── Preset schedules — no days, no overlaps, clean sequential times ──

const PRESET_SCHEDULES: Record<string, DemoTask[]> = {
  college: [
    { id: "t-1", title: "Morning Gym",         start: "07:00", end: "08:00", category: "HEALTH",   estimatedMinutes: 60  },
    { id: "t-2", title: "Bio Exam Review",      start: "08:15", end: "10:15", category: "DEADLINE", estimatedMinutes: 120 },
    { id: "t-3", title: "Chem Lab Report",      start: "10:30", end: "12:30", category: "DEADLINE", estimatedMinutes: 120 },
    { id: "t-4", title: "Renew Prescription",   start: "13:00", end: "13:45", category: "ADMIN",    estimatedMinutes: 45  },
    { id: "t-5", title: "Call Mom",             start: "14:00", end: "14:30", category: "LEISURE",  estimatedMinutes: 30  },
    { id: "t-6", title: "Café Shift",           start: "16:00", end: "20:00", category: "ADMIN",    estimatedMinutes: 240 },
    { id: "t-7", title: "Study Group",          start: "20:15", end: "21:15", category: "FOCUS",    estimatedMinutes: 60  },
  ],
  freelancer: [
    { id: "t-1", title: "Coffee — Referral",        start: "09:00", end: "09:45", category: "LEISURE", estimatedMinutes: 45  },
    { id: "t-2", title: "Focus Block — Design Work", start: "10:00", end: "14:00", category: "FOCUS",   estimatedMinutes: 240 },
    { id: "t-3", title: "Client Call",               start: "14:15", end: "15:15", category: "ADMIN",   estimatedMinutes: 60  },
    { id: "t-4", title: "Focus Block — Revisions",   start: "15:30", end: "17:30", category: "FOCUS",   estimatedMinutes: 120 },
    { id: "t-5", title: "Send Invoice",              start: "17:45", end: "18:15", category: "ADMIN",   estimatedMinutes: 30  },
  ],
  parent: [
    { id: "t-1", title: "Morning Workout",      start: "07:00", end: "07:45", category: "HEALTH",   estimatedMinutes: 45  },
    { id: "t-2", title: "Morning Meeting",       start: "09:00", end: "10:15", category: "ADMIN",    estimatedMinutes: 75  },
    { id: "t-3", title: "Q3 Deck Prep",         start: "10:30", end: "12:30", category: "FOCUS",    estimatedMinutes: 120 },
    { id: "t-4", title: "Dentist Appointment",  start: "14:00", end: "15:00", category: "ADMIN",    estimatedMinutes: 60  },
    { id: "t-5", title: "Grocery Run",          start: "15:15", end: "16:00", category: "ADMIN",    estimatedMinutes: 45  },
    { id: "t-6", title: "Soccer + Drive",       start: "16:15", end: "17:45", category: "LEISURE",  estimatedMinutes: 90  },
    { id: "t-7", title: "Pick Up Dry Cleaning", start: "18:00", end: "18:30", category: "ADMIN",    estimatedMinutes: 30  },
  ],
};

// ── Keyword matchers ──────────────────────────────────────────

const DEADLINE_KEYWORDS = /exam|test|due|deadline|report|submit|turn in|presentation/gi;
const FOCUS_KEYWORDS    = /study|work on|write|design|code|prep|prepare|review|practice|focus|block/gi;
const HEALTH_KEYWORDS   = /gym|workout|run|exercise|walk|yoga|training/gi;
const LEISURE_KEYWORDS  = /coffee|lunch|dinner|catch-up|hang|watch|movie|game|read/gi;
const ADMIN_KEYWORDS    = /email|reply|invoice|call|meeting|appointment|schedule|buy|grocery|pickup/gi;

const DURATION_30  = /quick|30 min|half hour/gi;
const DURATION_60  = /\b(hour|1 hour|an hour)\b/gi;
const DURATION_120 = /2 hours|two hours/gi;

function extractPhrase(text: string, index: number, keywordLen: number): string {
  const start = Math.max(0, text.lastIndexOf(" ", index - keywordLen - 1) + 1);
  const end   = Math.min(text.length, text.indexOf(" ", index + 50) || text.length);
  const words = text.slice(start, end).trim().split(/\s+/).slice(-6);
  const phrase = words.join(" ");
  return phrase.charAt(0).toUpperCase() + phrase.slice(1).toLowerCase();
}

function parseTimeHint(near: string): number | null {
  const am = near.match(/(\d{1,2}):?(\d{2})?\s*am/i);
  if (am) return (parseInt(am[1], 10) % 12) * 60 + (parseInt(am[2] || "0", 10));
  const pm = near.match(/(\d{1,2}):?(\d{2})?\s*pm/i);
  if (pm) return (parseInt(pm[1], 10) % 12) * 60 + (parseInt(pm[2] || "0", 10)) + 12 * 60;
  if (/morning/i.test(near))   return 9 * 60;
  if (/afternoon/i.test(near)) return 13 * 60;
  if (/evening/i.test(near))   return 18 * 60;
  if (/night/i.test(near))     return 20 * 60;
  return null;
}

function estimateDuration(text: string, category: TaskCategory): number {
  if (DURATION_30.test(text))  return 30;
  if (DURATION_60.test(text))  return 60;
  if (DURATION_120.test(text)) return 120;
  switch (category) {
    case "DEADLINE":
    case "FOCUS":   return 90;
    case "HEALTH":  return 60;
    default:        return 45;
  }
}

function toTimeStr(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// ── Overlap resolver ──────────────────────────────────────────

function resolveOverlaps(tasks: DemoTask[]): DemoTask[] {
  const toMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const sorted = [...tasks].sort((a, b) => toMins(a.start) - toMins(b.start));
  const resolved: DemoTask[] = [];

  for (const task of sorted) {
    let start    = toMins(task.start);
    const dur    = task.estimatedMinutes;
    let latestEnd = 0;

    for (const placed of resolved) {
      const ps = toMins(placed.start);
      const pe = toMins(placed.end);
      if (start < pe && start + dur > ps) {
        latestEnd = Math.max(latestEnd, pe);
      }
    }

    if (latestEnd > 0) start = latestEnd + 15;
    if (start + dur > 22 * 60) start = Math.max(7 * 60, 22 * 60 - dur);

    resolved.push({ ...task, start: toTimeStr(start), end: toTimeStr(start + dur) });
  }

  return resolved;
}

// ── Keyword extractor (for custom/free-typed input) ───────────

function extractAndSchedule(text: string): DemoTask[] {
  const raw: { title: string; category: TaskCategory; timeHint: number | null; urgency: number }[] = [];

  const run = (regex: RegExp, category: TaskCategory, urgency: number) => {
    let m: RegExpExecArray | null;
    const re = new RegExp(regex.source, "gi");
    while ((m = re.exec(text)) !== null) {
      const phrase = extractPhrase(text, m.index, m[0].length);
      const near   = text.slice(Math.max(0, m.index - 80), m.index + 80);
      raw.push({ title: phrase, category, timeHint: parseTimeHint(near), urgency });
    }
  };

  run(DEADLINE_KEYWORDS, "DEADLINE", 3);
  run(FOCUS_KEYWORDS,    "FOCUS",    2);
  run(HEALTH_KEYWORDS,   "HEALTH",   2);
  run(LEISURE_KEYWORDS,  "LEISURE",  0);
  run(ADMIN_KEYWORDS,    "ADMIN",    1);

  raw.sort((a, b) => b.urgency - a.urgency);

  let cursor = 9 * 60;
  const tasks: DemoTask[] = raw.map((t, idx) => {
    let start = t.timeHint ?? cursor;
    if (t.category === "HEALTH"  && !(start >= 7 * 60 && start < 9 * 60)) start = 7 * 60;
    if (t.category === "LEISURE" && !(start >= 12 * 60 && start < 13 * 60)) start = 12 * 60;
    start = Math.max(7 * 60, Math.min(21 * 60, start));
    const dur = estimateDuration(text, t.category);
    cursor = start + dur + 15;
    if (cursor > 22 * 60) cursor = 9 * 60;
    return {
      id: `t-${idx + 1}`,
      title: t.title,
      start: toTimeStr(start),
      end: toTimeStr(Math.min(start + dur, 22 * 60)),
      category: t.category,
      estimatedMinutes: dur,
    };
  });

  return tasks;
}

// ── Public entry point ────────────────────────────────────────

function normalizeForPreset(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

export function scheduleFromTranscript(transcript: string): DemoTask[] {
  const normalized = normalizeForPreset(transcript);

  for (const scenario of SCENARIOS) {
    if (normalizeForPreset(scenario.transcript) === normalized) {
      const preset = PRESET_SCHEDULES[scenario.id];
      if (preset) return resolveOverlaps(preset.map((t, i) => ({ ...t, id: `t-${i + 1}` })));
    }
  }

  return resolveOverlaps(extractAndSchedule(transcript));
}
