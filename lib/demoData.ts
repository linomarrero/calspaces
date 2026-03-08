export type TaskCategory = "urgent" | "work" | "personal" | "admin";

export interface DemoTask {
  id: string;
  title: string;
  start: string; // "09:00"
  end: string;
  category: TaskCategory;
  urgencyReason?: string;
  estimatedMinutes: number;
  completed?: boolean;
}

export interface BrainDumpScenario {
  id: string;
  label: string;
  transcript: string;
}

export const SCENARIOS: BrainDumpScenario[] = [
  {
    id: "college-midterms",
    label: "College student — midterms week",
    transcript: `Okay so. Bio exam Thursday 9am, have to review chapters 4 through 7. Chem lab report due Wednesday by 5pm. I work Tuesday and Thursday 4 to 8 at the café. Gym Monday Wednesday Friday, I usually go around 10. Need to call my mom sometime this week. Laundry. Oh and I have a study group Tuesday 7pm. And I keep forgetting to renew my prescription — need to do that before I run out. Maybe Thursday after the exam?`,
  },
  {
    id: "freelancer-crunch",
    label: "Freelancer — project crunch",
    transcript: `Client deliverable due Friday EOD, that's the big one. Two rounds of revisions left. I've got a call with them Tuesday 2pm. Need to block focus time for the actual design work — probably three four-hour blocks. Coffee with the referral guy Wednesday 10am. Invoice the other client by Thursday. And I need to actually sleep — last week I was up till 2 every night. So no work after 11pm.`,
  },
  {
    id: "parent-thursday",
    label: "Working parent — busy Thursday",
    transcript: `Kids have soccer at 4:30, I'm driving. So I need to leave by 4. Meeting at 9 that might run over — put buffer after. Dentist at 2pm, already booked. Need to finish the Q3 deck for Friday morning. Grocery run has to happen, maybe right after dentist? And the dog has a vet appointment — wait, that's next week. So just groceries. Pick up dry cleaning at some point.`,
  },
];

/** Mock scheduler: parses transcript and returns tasks for the demo. No backend. */
export function mockScheduleFromTranscript(transcript: string): DemoTask[] {
  const lower = transcript.toLowerCase();
  const tasks: DemoTask[] = [];
  let id = 0;
  const add = (
    title: string,
    start: string,
    durationMinutes: number,
    category: TaskCategory,
    urgencyReason?: string
  ) => {
    const [sh, sm] = start.split(":").map(Number);
    const endMinutes = sh * 60 + sm + durationMinutes;
    const eh = Math.floor(endMinutes / 60);
    const em = endMinutes % 60;
    tasks.push({
      id: `t-${++id}`,
      title,
      start,
      end: `${eh.toString().padStart(2, "0")}:${em.toString().padStart(2, "0")}`,
      category,
      urgencyReason,
      estimatedMinutes: durationMinutes,
    });
  };

  // Scenario-specific mock logic for consistent demo
  if (lower.includes("bio exam") || lower.includes("midterms")) {
    add("Review Bio ch. 4–7", "07:00", 90, "work", "Exam Thursday 9am");
    add("Chem lab report", "14:00", 120, "urgent", "Due Wednesday 5pm");
    add("Café shift", "16:00", 240, "work");
    add("Gym", "10:00", 60, "personal");
    add("Study group", "19:00", 90, "work");
    add("Call mom", "12:00", 20, "personal");
    add("Laundry", "20:00", 45, "admin");
    add("Renew prescription", "10:00", 30, "admin");
  } else if (lower.includes("client") || lower.includes("deliverable") || lower.includes("freelancer")) {
    add("Focus block — design", "09:00", 240, "work", "Deliverable Friday EOD");
    add("Client call", "14:00", 60, "work");
    add("Focus block — revisions", "16:00", 120, "work");
    add("Coffee — referral", "10:00", 45, "work");
    add("Send invoice", "11:00", 30, "admin");
    add("Wind down / no work", "23:00", 60, "personal");
  } else {
    add("Q3 deck", "09:00", 90, "work", "For Friday morning");
    add("Meeting + buffer", "09:00", 120, "work");
    add("Dentist", "14:00", 60, "personal");
    add("Grocery run", "15:00", 45, "admin");
    add("Soccer — drive", "16:00", 90, "personal");
    add("Dry cleaning", "12:00", 20, "admin");
  }

  return tasks.sort((a, b) => a.start.localeCompare(b.start));
}
