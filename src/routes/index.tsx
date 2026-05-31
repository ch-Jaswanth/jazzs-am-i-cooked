import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Flame, Sparkles, RotateCcw } from "lucide-react";
import { Embers } from "@/components/Embers";
import { Gauge } from "@/components/Gauge";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ShareCard } from "@/components/ShareCard";
import { DeveloperLog } from "@/components/DeveloperLog";
import {
  computeResult,
  personalizedRoast,
  attendanceMessage,
  syllabusMessage,
  daysMessage,
  assignmentsMessage,
  reelsMessage,
  confidenceMessage,
  reelsLabel,
  type Inputs,
  type ReelsBucket,
  type Result,
} from "@/lib/cooked";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Am I Cooked? — The Academic Survival Calculator" },
      {
        name: "description",
        content:
          "Find out how close you are to academic extinction. The internet's most scientifically inaccurate academic survival predictor.",
      },
      { property: "og:title", content: "Am I Cooked? — The Academic Survival Calculator" },
      {
        property: "og:description",
        content: "Find out how cooked you really are before your next exam.",
      },
    ],
  }),
  component: Index,
});

const REELS_OPTIONS: ReelsBucket[] = ["0-30", "30-60", "1-2", "2-4", "4+"];

function Index() {
  const [inputs, setInputs] = useState<Inputs>({
    attendance: 65,
    totalChapters: 10,
    chaptersDone: 3,
    daysUntilExam: 14,
    assignments: 2,
    reels: "1-2",
    confidence: 50,
  });
  const [stage, setStage] = useState<"form" | "loading" | "result">("form");
  const [result, setResult] = useState<Result | null>(null);
  const [shake, setShake] = useState(false);
  const [chapterError, setChapterError] = useState<string | null>(null);
  const [devLogOpen, setDevLogOpen] = useState(false);
  const [devLogSeen, setDevLogSeen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputs.totalChapters === 143 && !devLogSeen) {
      setDevLogOpen(true);
      setDevLogSeen(true);
    }
    if (inputs.totalChapters !== 143 && devLogSeen) {
      setDevLogSeen(false);
    }
  }, [inputs.totalChapters, devLogSeen]);

  const update = <K extends keyof Inputs>(k: K, v: Inputs[K]) =>
    setInputs((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (inputs.chaptersDone > inputs.totalChapters) {
      setChapterError("Nice try, but that's not how chapters work.");
    } else setChapterError(null);
  }, [inputs.chaptersDone, inputs.totalChapters]);

  const syllabusPct = useMemo(
    () =>
      inputs.totalChapters > 0
        ? Math.min(100, Math.round((inputs.chaptersDone / inputs.totalChapters) * 100))
        : 0,
    [inputs.chaptersDone, inputs.totalChapters],
  );

  const handleCalculate = () => {
    if (chapterError) return;
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setStage("loading");
  };

  const handleLoadingDone = () => {
    const r = computeResult(inputs);
    setResult(r);
    setStage("result");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const reset = () => {
    setStage("form");
    setResult(null);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleShare = (platform: "wa" | "ig") => {
    if (!result) return;
    const text = `🍳 I am ${result.score}% COOKED. Status: ${result.level.label}. Cause of death: ${result.causeOfDeath}. Find out yours:`;
    const url = window.location.href;
    if (platform === "wa") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    } else {
      navigator.clipboard?.writeText(text + " " + url);
      alert("Link copied! Paste it into your Instagram story.");
    }
  };

  const roastLines = result ? personalizedRoast(inputs, result) : [];

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${shake ? "animate-shake" : ""}`}>
      <Embers />

      {stage === "loading" && <LoadingOverlay onDone={handleLoadingDone} />}
      {devLogOpen && <DeveloperLog onClose={() => setDevLogOpen(false)} />}

      <div className="relative z-10">
        {/* NAV */}
        <header className="px-6 py-5 sm:px-10 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-lg" style={{ background: "var(--gradient-fire)" }}>
              🍳
            </div>
            <span className="font-display font-bold text-lg">Am I Cooked?</span>
            <span className="text-[0.6rem] sm:text-xs font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border border-accent/40 text-accent bg-accent/5">
              Jazz Edition
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Jazz is online
          </div>
        </header>

        {/* HERO */}
        <section className="px-6 pt-12 pb-20 sm:pt-20 sm:pb-32 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6 animate-fade-in">
            <Sparkles className="h-3 w-3" /> Trusted by 0 universities worldwide
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter font-display leading-[0.95]">
            <span className="inline-block mr-2">🍳</span>
            <span className="text-gradient-fire">AM I COOKED?</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
            Find out how close you are to academic extinction.
          </p>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
            The internet's most scientifically inaccurate academic survival predictor.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="btn-fire px-8 py-4 rounded-2xl text-base inline-flex items-center gap-2"
            >
              <Flame className="h-5 w-5" /> CHECK STATUS
            </button>
            <button
              onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-foreground transition"
            >
              Scroll <ChevronDown className="h-3 w-3 animate-bounce" />
            </button>
          </div>

          {/* Stat strip */}
          <div className="mt-20 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { v: "10,000+", l: "Students Cooked" },
              { v: "97.5%", l: "Verdict Accuracy*" },
              { v: "0", l: "Lives Saved" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl p-4 sm:p-5">
                <div className="text-2xl sm:text-3xl font-bold text-gradient-fire font-display">{s.v}</div>
                <div className="text-[0.65rem] sm:text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FORM */}
        <section ref={formRef} className="px-6 pb-24 max-w-3xl mx-auto scroll-mt-10">
          <div className="text-center mb-10">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Step 1 of 1</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold font-display">Tell Jazz everything.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Be honest. He'll find out anyway.</p>
          </div>

          <div className="space-y-5">
            {/* Attendance */}
            <Field
              icon="🎓"
              label="Attendance"
              message={attendanceMessage(inputs.attendance)}
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-4xl font-bold font-display text-gradient-fire">{inputs.attendance}%</span>
              </div>
              <FireSlider value={inputs.attendance} onChange={(v) => update("attendance", v)} />
            </Field>

            {/* Syllabus */}
            <Field icon="📚" label="Syllabus Progress" message={syllabusMessage(syllabusPct)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberInput
                  label="Completed"
                  value={inputs.chaptersDone}
                  onChange={(v) => update("chaptersDone", v)}
                  min={0}
                />
                <NumberInput
                  label="Total chapters"
                  value={inputs.totalChapters}
                  onChange={(v) => update("totalChapters", v)}
                  min={1}
                />
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>{inputs.chaptersDone} / {inputs.totalChapters}</span>
                  <span>{syllabusPct}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${syllabusPct}%`, background: "var(--gradient-fire)" }}
                  />
                </div>
              </div>
              {chapterError && (
                <div className="mt-3 px-3 py-2 rounded-lg text-xs text-destructive-foreground border border-destructive/40 bg-destructive/10">
                  <span className="font-bold">— Jazz</span> · {chapterError}
                </div>
              )}
            </Field>

            {/* Days */}
            <Field icon="⏳" label="Days Until Exam" message={daysMessage(inputs.daysUntilExam)}>
              <NumberInput
                value={inputs.daysUntilExam}
                onChange={(v) => update("daysUntilExam", v)}
                min={0}
              />
            </Field>

            {/* Assignments */}
            <Field icon="📝" label="Assignments Pending" message={assignmentsMessage(inputs.assignments)}>
              <NumberInput
                value={inputs.assignments}
                onChange={(v) => update("assignments", v)}
                min={0}
              />
            </Field>

            {/* Reels */}
            <Field icon="📱" label="Reels / Shorts Per Day" message={reelsMessage(inputs.reels)}>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {REELS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => update("reels", r)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition border ${
                      inputs.reels === r
                        ? "border-transparent text-background"
                        : "border-border text-foreground/80 hover:border-white/20"
                    }`}
                    style={inputs.reels === r ? { background: "var(--gradient-fire)" } : {}}
                  >
                    {reelsLabel(r)}
                  </button>
                ))}
              </div>
            </Field>

            {/* Confidence */}
            <Field icon="😎" label="Confidence Level" message={confidenceMessage(inputs.confidence)}>
              <p className="text-xs text-muted-foreground mb-3">How confident are you that you'll pass?</p>
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-4xl font-bold font-display text-gradient-fire">{inputs.confidence}%</span>
              </div>
              <FireSlider value={inputs.confidence} onChange={(v) => update("confidence", v)} />
            </Field>

            <div className="pt-4 text-center">
              <button
                onClick={handleCalculate}
                disabled={!!chapterError || stage === "loading"}
                className="btn-fire px-10 py-5 rounded-2xl text-base sm:text-lg w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
              >
                {stage === "loading" ? "Jazz is judging..." : "CALCULATE MY FATE"}
              </button>
              <p className="mt-3 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                * Results are final and emotionally binding
              </p>
            </div>
          </div>
        </section>

        {/* RESULTS */}
        {stage === "result" && result && (
          <section ref={resultRef} className="px-6 pb-24 max-w-4xl mx-auto scroll-mt-10 animate-fade-in">
            <div className="text-center mb-2">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Official Verdict</div>
            </div>

            <Gauge score={result.score} color={result.level.color} label={result.level.label} />

            <div className="mt-8 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-bold font-display">
                {result.level.emoji} {result.level.label}
              </h2>
              <p className="mt-4 text-lg text-foreground/85">{result.level.verdict}</p>
            </div>

            {/* Jazz roast */}
            <div className="mt-10 glass-strong rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto animate-scale-in">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center font-bold"
                  style={{ background: "var(--gradient-fire)", color: "oklch(0.1 0 0)" }}
                >
                  J
                </div>
                <div>
                  <div className="font-semibold">Jazz</div>
                  <div className="text-xs text-muted-foreground">Chief Roast Officer</div>
                </div>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-foreground/90 mb-4">
                {result.level.roast}
              </p>
              <ul className="space-y-2 border-t border-border pt-4">
                {roastLines.map((l, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/80">
                    <span className="text-accent">›</span> {l}
                  </li>
                ))}
              </ul>
              {result.easterEgg && (
                <div className="mt-4 p-4 rounded-xl border border-accent/40 bg-accent/5 text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">Easter Egg Unlocked</span>
                  <p className="mt-1 text-foreground/90">{result.easterEgg}</p>
                </div>
              )}
            </div>

            {/* Stats grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              <StatCard label="Class Rank" value={`#${result.rank.toLocaleString()}`} sub="of 10,000" />
              <StatCard label="More Cooked Than" value={`${result.percentile.toFixed(1)}%`} sub="of students" />
              <StatCard label="Cause of Death" value={result.causeOfDeath} sub="primary factor" />
            </div>

            {/* Share */}
            <div className="mt-12 max-w-md mx-auto">
              <h3 className="text-center text-lg font-semibold mb-4">Share your shame</h3>
              <ShareCard result={result} onShare={handleShare} />
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass text-sm font-medium hover:bg-white/5 transition"
              >
                <RotateCcw className="h-4 w-4" /> Try again with different lies
              </button>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="px-6 py-10 border-t border-border text-center text-xs text-muted-foreground">
          <p>Built with caffeine, regret, and zero academic credentials.</p>
          <p className="mt-1">Not affiliated with any university, exam board, or Jazz himself.</p>
        </footer>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  message,
  children,
}: {
  icon: string;
  label: string;
  message: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-display font-semibold text-base">{label}</h3>
        </div>
      </div>
      {children}
      <p key={message} className="mt-4 text-xs text-muted-foreground italic animate-fade-in border-l-2 border-accent/40 pl-3">
        {message}
      </p>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  label?: string;
}) {
  return (
    <label className="block min-w-0">
      {label && <span className="block text-[0.65rem] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>}
      <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-10 w-10 rounded-xl glass-strong text-lg hover:bg-white/5 transition"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          min={min}
          onChange={(e) => onChange(Math.max(min, parseInt(e.target.value) || 0))}
          className="h-10 w-full min-w-0 px-2 rounded-xl bg-input border border-border text-center font-display font-semibold text-lg focus:outline-none focus:border-accent transition"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="h-10 w-10 rounded-xl glass-strong text-lg hover:bg-white/5 transition"
        >
          +
        </button>
      </div>
    </label>
  );
}

function FireSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="relative py-3">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="fire-slider w-full"
        style={{
          // @ts-expect-error CSS var
          "--val": `${value}%`,
        }}
      />
      <style>{`
        .fire-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(to right, var(--flame) 0%, var(--ember) var(--val), oklch(1 0 0 / 0.08) var(--val), oklch(1 0 0 / 0.08) 100%);
          outline: none;
        }
        .fire-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px; height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, oklch(0.88 0.18 90), oklch(0.62 0.24 28));
          border: 2px solid oklch(0.1 0 0);
          box-shadow: 0 0 16px oklch(0.7 0.2 45 / 0.8);
          cursor: pointer;
          transition: transform 0.15s;
        }
        .fire-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .fire-slider::-moz-range-thumb {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, oklch(0.88 0.18 90), oklch(0.62 0.24 28));
          border: 2px solid oklch(0.1 0 0);
          box-shadow: 0 0 16px oklch(0.7 0.2 45 / 0.8);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display font-bold text-xl text-gradient-fire truncate">{value}</div>
      <div className="text-[0.65rem] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
