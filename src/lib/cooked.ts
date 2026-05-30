// Cookedness scoring + Jazz commentary

export type ReelsBucket = "0-30" | "30-60" | "1-2" | "2-4" | "4+";

export interface Inputs {
  attendance: number; // 0-100
  totalChapters: number;
  chaptersDone: number;
  daysUntilExam: number;
  assignments: number;
  reels: ReelsBucket;
  confidence: number; // 0-100
}

export interface Result {
  score: number; // 0-100 cookedness
  level: Level;
  rank: number;
  percentile: number;
  causeOfDeath: string;
  easterEgg?: string;
  syllabusPct: number;
}

export type Level = {
  key: "safe" | "almost" | "cooked" | "fried" | "absolute";
  label: string;
  emoji: string;
  color: string;
  verdict: string;
  roast: string;
};

export const LEVELS: Level[] = [
  {
    key: "safe",
    label: "SAFE",
    emoji: "🟢",
    color: "oklch(0.75 0.18 145)",
    verdict: "You're fine. Stop taking this test and go touch some grass.",
    roast: "Bro, you're doing fine. Why are you on my website? Go study some more.",
  },
  {
    key: "almost",
    label: "ALMOST COOKED",
    emoji: "🟡",
    color: "oklch(0.85 0.18 95)",
    verdict: "Situation manageable… for now.",
    roast: "I was hoping to roast you, but unfortunately you're just another default engineering student.",
  },
  {
    key: "cooked",
    label: "COOKED",
    emoji: "🟠",
    color: "oklch(0.74 0.2 55)",
    verdict: "The warning signs have been warning for a while.",
    roast: "You've spent more time planning to study than actually studying. You're treating the semester like a side quest.",
  },
  {
    key: "fried",
    label: "FRIED",
    emoji: "🔴",
    color: "oklch(0.62 0.24 28)",
    verdict: "You are actively getting cooked.",
    roast: "Bro, your attendance and marks are in a full-on competition to see who can be lower.",
  },
  {
    key: "absolute",
    label: "ABSOLUTELY COOKED",
    emoji: "⚫",
    color: "oklch(0.35 0.05 30)",
    verdict: "We regret to inform you that you are definitely, absolutely cooked.",
    roast:
      "You're not preparing for the exam. You're preparing for character development, regret, caffeine addiction, and last-minute panic.",
  },
];

const REELS_WEIGHT: Record<ReelsBucket, number> = {
  "0-30": 0,
  "30-60": 10,
  "1-2": 30,
  "2-4": 60,
  "4+": 95,
};

export function reelsLabel(r: ReelsBucket) {
  return { "0-30": "0–30 min", "30-60": "30–60 min", "1-2": "1–2 hrs", "2-4": "2–4 hrs", "4+": "4+ hrs" }[r];
}

export function attendanceMessage(a: number) {
  if (a >= 90) return "Teacher knows your name and probably expects things from you.";
  if (a >= 75) return "Looking good.";
  if (a >= 60) return "Could be better.";
  if (a >= 40) return "Getting risky.";
  if (a >= 20) return "You should probably start attending.";
  return "Are you even enrolled here?";
}

export function syllabusMessage(p: number) {
  if (p >= 100) return "Bro finished the whole syllabus. Why are you here?";
  if (p >= 75) return "You're actually studying. Weird.";
  if (p >= 50) return "Not bad. The syllabus is still winning, but not by much.";
  if (p >= 25) return "You looked at the syllabus and chose violence.";
  if (p >= 1) return "Calling this preparation is very generous.";
  return "Outstanding. You've managed to avoid every chapter.";
}

export function daysMessage(d: number) {
  if (d >= 31) return "Relax. You've got time. Don't waste all of it.";
  if (d >= 21) return "Plenty of time. Whether you'll use it is another question.";
  if (d >= 14) return "This is usually when people start saying they'll study tomorrow.";
  if (d >= 7) return "The exam can see you now.";
  if (d >= 4) return "Might be a good time to find where you kept your textbook.";
  if (d >= 2) return "We are entering the panic zone.";
  if (d === 1) return "Ah yes. The annual syllabus speedrun.";
  return "Why are you on my website? Open your notes.";
}

export function assignmentsMessage(a: number) {
  if (a === 0) return "Responsible human.";
  if (a <= 3) return "Manageable.";
  if (a <= 7) return "You should get those done.";
  return "Academic criminal.";
}

export function reelsMessage(r: ReelsBucket) {
  return {
    "0-30": "Self control detected.",
    "30-60": "Acceptable.",
    "1-2": "That's a chapter or two right there.",
    "2-4": "The algorithm knows you personally.",
    "4+": "Your screen time is studying harder than you are.",
  }[r];
}

export function confidenceMessage(c: number) {
  if (c <= 20) return "At least you're honest.";
  if (c <= 40) return "Realistic. I respect it.";
  if (c <= 60) return "Could go either way.";
  if (c <= 80) return "That's a lot of confidence for someone using this website.";
  return "Confidence detected. Evidence pending.";
}

export function computeResult(input: Inputs): Result {
  const syllabusPct =
    input.totalChapters > 0
      ? Math.min(100, Math.round((input.chaptersDone / input.totalChapters) * 100))
      : 0;

  // 1. Attendance
  const attendanceCooked = 100 - input.attendance;
  const attendanceScore = attendanceCooked * 0.25;

  // 2. Syllabus
  const syllabusCooked = 100 - syllabusPct;
  const syllabusScore = syllabusCooked * 0.35;

  // 3. Assignments (max 10 considered)
  const assignmentCooked = Math.min(100, (input.assignments / 10) * 100);
  const assignmentScore = assignmentCooked * 0.15;

  // 4. Reels
  const reelsCookedMap: Record<ReelsBucket, number> = {
    "0-30": 0,
    "30-60": 20,
    "1-2": 40,
    "2-4": 70,
    "4+": 100,
  };
  const reelsCooked = reelsCookedMap[input.reels];
  const reelsScore = reelsCooked * 0.10;

  // 5. Confidence — only false confidence is punished
  const assignmentCompletion = 100 - assignmentCooked;
  const preparationScore = (input.attendance + syllabusPct + assignmentCompletion) / 3;
  const confidenceGap = Math.max(0, input.confidence - preparationScore);
  const confidenceScore = confidenceGap * 0.15;

  const raw =
    attendanceScore + syllabusScore + assignmentScore + reelsScore + confidenceScore;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  const level =
    score <= 20 ? LEVELS[0] :
    score <= 40 ? LEVELS[1] :
    score <= 60 ? LEVELS[2] :
    score <= 80 ? LEVELS[3] : LEVELS[4];

  const totalStudents = 10000;
  const percentile = score;
  const rank = Math.max(1, Math.round(totalStudents * (1 - score / 100) + Math.random() * 50));

  // Cause of death — metric contributing most cooked points
  const factors: { label: string; weight: number }[] = [
    { label: "Poor Attendance", weight: attendanceScore },
    { label: "Low Syllabus Completion", weight: syllabusScore },
    { label: "Assignment Neglect", weight: assignmentScore },
    { label: "Reels Addiction", weight: reelsScore },
    { label: "False Confidence", weight: confidenceScore },
  ];
  factors.sort((a, b) => b.weight - a.weight);
  const causeOfDeath = score < 20 ? "Excessive Wellbeing" : factors[0].label;

  // Easter eggs
  let easterEgg: string | undefined;
  if (input.attendance === 100 && syllabusPct === 100 && input.assignments === 0 && (input.reels === "0-30" || input.reels === "30-60")) {
    easterEgg =
      "Be honest. You're just testing the website. With 100% attendance, it's pretty obvious that sitting in lectures is the highlight of your week.";
  } else if (input.attendance === 0 && syllabusPct === 0 && input.assignments === 0) {
    easterEgg = "The professor is going to need your ID once you decide to show up to class.";
  } else if (input.daysUntilExam <= 1 && syllabusPct < 20) {
    easterEgg = "This isn't preparation. This is gambling.";
  } else if ((input.reels === "4+" || input.reels === "2-4") && syllabusPct < 10) {
    easterEgg = "You've completed 17 seasons of scrolling and 0 chapters of studying.";
  }

  return { score, level, rank, percentile, causeOfDeath, easterEgg, syllabusPct };
}

export function personalizedRoast(input: Inputs, r: Result): string[] {
  const lines: string[] = [];
  if (input.attendance < 40) lines.push("Bro has attended fewer classes than national holidays.");
  if (r.syllabusPct < 25 && input.confidence > 60) lines.push("Your study plan appears to be based entirely on miracles.");
  if (r.syllabusPct < 30 && input.daysUntilExam <= 7) lines.push("At this point the syllabus knows more about you than you know about it.");
  if ((input.reels === "2-4" || input.reels === "4+") && r.syllabusPct < 50) lines.push("You've completed more reels than chapters.");
  if (input.assignments >= 8) lines.push("Your pending assignments have started forming their own student union.");
  if (input.confidence >= 80 && r.score >= 60) lines.push("The confidence is admirable. The data is concerning.");
  if (input.daysUntilExam <= 2 && r.syllabusPct < 40) lines.push("The textbook is now a stranger to you. Reintroduce yourselves.");
  if (lines.length === 0) lines.push("Honestly? You're suspiciously well-balanced. Are you ok?");
  return lines.slice(0, 4);
}

export const LOADING_MESSAGES = [
  "Calculating regret...",
  "Estimating panic levels...",
  "Reviewing life choices...",
  "Checking exam survival chances...",
  "Searching for hope...",
  "Running advanced cookedness algorithm...",
  "Jazz is reviewing your decisions...",
  "Jazz is trying to find good news...",
  "Finalizing verdict...",
];
