export type TaskCategory = "FOCUS" | "HEALTH" | "LEISURE" | "ADMIN" | "DEADLINE";

export interface DemoTask {
  id: string;
  title: string;
  start: string;
  end: string;
  day: string;
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
    transcript: `Okay so. Bio exam Thursday 9am, have to review chapters 4 through 7. Chem lab report due Wednesday by 5pm. I work Tuesday and Thursday 4 to 8 at the café. Gym Monday Wednesday Friday, I usually go around 10. Need to call my mom sometime this week. Laundry. Oh and I have a study group Tuesday 7pm. And I keep forgetting to renew my prescription — need to do that before I run out. Maybe Thursday after the exam?`,
  },
  {
    id: "freelancer",
    label: "Freelancer — project crunch",
    transcript: `Client deliverable due Friday EOD, that's the big one. Two rounds of revisions left. I've got a call with them Tuesday 2pm. Need to block focus time for the actual design work — probably three four-hour blocks. Coffee with the referral guy Wednesday 10am. Invoice the other client by Thursday. And I need to actually sleep — last week I was up till 2 every night. So no work after 11pm.`,
  },
  {
    id: "parent",
    label: "Working parent — busy Thursday",
    transcript: `Kids have soccer at 4:30, I'm driving. So I need to leave by 4. Meeting at 9 that might run over — put buffer after. Dentist at 2pm, already booked. Need to finish the Q3 deck for Friday morning. Grocery run has to happen, maybe right after dentist? And the dog has a vet appointment — wait, that's next week. So just groceries. Pick up dry cleaning at some point.`,
  },
];

const DEADLINE_KEYWORDS = /exam|test|due|deadline|report|submit|turn in|presentation/gi;
const FOCUS_KEYWORDS = /study|work on|write|design|code|prep|prepare|review|practice|focus|block/gi;
const HEALTH_KEYWORDS = /gym|workout|run|exercise|walk|yoga|training/gi;
const LEISURE_KEYWORDS = /coffee|lunch|dinner|catch-up|hang|watch|movie|game|read/gi;
const ADMIN_KEYWORDS = /email|reply|invoice|call|meeting|appointment|schedule|buy|grocery|pickup/gi;

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DURATION_30 = /quick|30 min|half hour/gi;
const DURATION_60 = /\b(hour|1 hour|an hour)\b/gi;
const DURATION_120 = /2 hours|two hours/gi;

function extractPhrase(text: string, index: number, keywordLen: number): string {
  const start = Math.max(0, text.lastIndexOf(" ", index - keywordLen - 1) + 1);
  const end = Math.min(text.length, text.indexOf(" ", index + 50) || text.length);
  let phrase = text.slice(start, end).trim();
  const words = phrase.split(/\s+/).slice(-6);
  phrase = words.join(" ");
  return phrase.charAt(0).toUpperCase() + phrase.slice(1).toLowerCase();
}

function parseTimeHint(near: string): number | null {
  const m = near.match(/(\d{1,2}):?(\d{2})?\s*am/i);
  if (m) return (parseInt(m[1], 10) % 12) * 60 + (parseInt(m[2] || "0", 10));
  const m2 = near.match(/(\d{1,2}):?(\d{2})?\s*pm/i);
  if (m2) return (parseInt(m2[1], 10) % 12) * 60 + (parseInt(m2[2] || "0", 10)) + 12 * 60;
  if (/morning/i.test(near)) return 9 * 60;
  if (/afternoon/i.test(near)) return 13 * 60;
  if (/evening/i.test(near)) return 18 * 60;
  if (/night/i.test(near)) return 20 * 60;
  return null;
}

function getDayHint(near: string): number | null {
  const match = near.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (!match) return null;
  const i = DAY_NAMES.map((d) => d.toLowerCase()).indexOf(match[1].toLowerCase());
  return i >= 0 ? i : null;
}

function estimateDuration(text: string, category: TaskCategory): number {
  if (DURATION_30.test(text)) return 30;
  if (DURATION_60.test(text)) return 60;
  if (DURATION_120.test(text)) return 120;
  switch (category) {
    case "DEADLINE":
    case "FOCUS":
      return 90;
    case "HEALTH":
      return 60;
    case "LEISURE":
    case "ADMIN":
      return 45;
    default:
      return 60;
  }
}

const PRESET_SCHEDULES: Record<string, DemoTask[]> = {
  college: [
    { id: "t-1", title: "Math Exam Prep", start: "07:00", end: "09:00", day: "Thursday", category: "FOCUS", estimatedMinutes: 120 },
    { id: "t-2", title: "Chem Lab Report", start: "09:00", end: "11:00", day: "Wednesday", category: "DEADLINE", estimatedMinutes: 120 },
    { id: "t-3", title: "Café Shift", start: "16:00", end: "20:00", day: "Tuesday", category: "ADMIN", estimatedMinutes: 240 },
    { id: "t-4", title: "Gym", start: "07:00", end: "08:00", day: "Wednesday", category: "HEALTH", estimatedMinutes: 60 },
    { id: "t-5", title: "Watch The Last of Us", start: "20:00", end: "21:00", day: "Friday", category: "LEISURE", estimatedMinutes: 60 },
  ],
  freelancer: [
    { id: "t-1", title: "Focus Block — Design Work", start: "09:00", end: "13:00", day: "Monday", category: "FOCUS", estimatedMinutes: 240 },
    { id: "t-2", title: "Client Call", start: "14:00", end: "15:00", day: "Tuesday", category: "ADMIN", estimatedMinutes: 60 },
    { id: "t-3", title: "Focus Block — Revisions", start: "09:00", end: "13:00", day: "Wednesday", category: "FOCUS", estimatedMinutes: 240 },
    { id: "t-4", title: "Coffee — Referral", start: "08:00", end: "08:45", day: "Wednesday", category: "LEISURE", estimatedMinutes: 45 },
    { id: "t-5", title: "Send Invoice", start: "11:00", end: "11:30", day: "Thursday", category: "ADMIN", estimatedMinutes: 30 },
  ],
  parent: [
    { id: "t-1", title: "Parent-Teacher Conference", start: "09:00", end: "10:00", day: "Thursday", category: "ADMIN", estimatedMinutes: 60 },
    { id: "t-2", title: "Presentation Prep", start: "10:30", end: "12:30", day: "Thursday", category: "FOCUS", estimatedMinutes: 120 },
    { id: "t-3", title: "Grocery Run", start: "13:00", end: "14:00", day: "Thursday", category: "ADMIN", estimatedMinutes: 60 },
    { id: "t-4", title: "School Pickup", start: "15:30", end: "16:00", day: "Thursday", category: "ADMIN", estimatedMinutes: 30 },
    { id: "t-5", title: "Soccer Practice", start: "17:00", end: "18:00", day: "Thursday", category: "HEALTH", estimatedMinutes: 60 },
    { id: "t-6", title: "Morning Workout", start: "07:00", end: "07:30", day: "Thursday", category: "HEALTH", estimatedMinutes: 30 },
    { id: "t-7", title: "Call Mom", start: "20:00", end: "20:30", day: "Thursday", category: "LEISURE", estimatedMinutes: 30 },
  ],
};

function toTimeStr(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function extractAndSchedule(text: string): DemoTask[] {
  const tasks: { title: string; category: TaskCategory; timeHint: number | null; dayHint: number | null; urgency: number }[] = [];

  const run = (regex: RegExp, category: TaskCategory, urgency: number) => {
    let m: RegExpExecArray | null;
    const re = new RegExp(regex.source, "gi");
    while ((m = re.exec(text)) !== null) {
      const phrase = extractPhrase(text, m.index, m[0].length);
      const near = text.slice(Math.max(0, m.index - 80), m.index + 80);
      const timeHint = parseTimeHint(near);
      const dayHint = getDayHint(near);
      tasks.push({ title: phrase, category, timeHint, dayHint, urgency });
    }
  };

  run(DEADLINE_KEYWORDS, "DEADLINE", 3);
  run(FOCUS_KEYWORDS, "FOCUS", 2);
  run(HEALTH_KEYWORDS, "HEALTH", 2);
  run(LEISURE_KEYWORDS, "LEISURE", 0);
  run(ADMIN_KEYWORDS, "ADMIN", 1);

  tasks.sort((a, b) => b.urgency - a.urgency);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const schedule: DemoTask[] = [];

  const preferHealth = (min: number) => (min >= 7 * 60 && min < 9 * 60) || min >= 18 * 60;
  const preferLeisure = (min: number) => (min >= 12 * 60 && min < 13 * 60) || min >= 19 * 60;

  let cursor = 9 * 60;
  const buffer = 15;

  tasks.forEach((t, idx) => {
    let start = t.timeHint ?? cursor;
    if (t.category === "HEALTH" && !preferHealth(start)) start = 7 * 60;
    if (t.category === "LEISURE" && !preferLeisure(start)) start = 12 * 60;
    start = Math.max(7 * 60, Math.min(22 * 60 - 30, start));
    const duration = estimateDuration(text, t.category);
    const endMinutes = start + duration;
    if (endMinutes > 22 * 60) return;
    const day = t.dayHint !== null ? DAY_NAMES[t.dayHint] : DAY_NAMES[dayOfWeek];
    schedule.push({
      id: `t-${idx + 1}`,
      title: t.title,
      start: toTimeStr(start),
      end: toTimeStr(endMinutes),
      day,
      category: t.category,
      estimatedMinutes: duration,
    });
    cursor = endMinutes + buffer;
    if (cursor > 22 * 60) cursor = 9 * 60;
  });

  return schedule.sort((a, b) => a.start.localeCompare(b.start));
}

function normalizeForPreset(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

function resolveOverlaps(tasks: DemoTask[]): DemoTask[] {
  const toMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const toTime = (mins: number) => {
    const h = Math.floor(mins / 60).toString().padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const sorted = [...tasks].sort((a, b) => toMins(a.start) - toMins(b.start));
  const resolved: DemoTask[] = [];

  for (const task of sorted) {
    let start = toMins(task.start);
    const duration = task.estimatedMinutes;

    let latestEnd = 0;
    for (const placed of resolved) {
      const placedStart = toMins(placed.start);
      const placedEnd = toMins(placed.end);
      if (start < placedEnd && start + duration > placedStart) {
        latestEnd = Math.max(latestEnd, placedEnd);
      }
    }

    if (latestEnd > 0) {
      start = latestEnd + 15;
    }

    if (start + duration > 1320) {
      start = Math.max(420, 1320 - duration);
    }

    resolved.push({
      ...task,
      start: toTime(start),
      end: toTime(start + duration),
    });
  }

  return resolved;
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
