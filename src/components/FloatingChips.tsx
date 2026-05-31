const CHIPS = [
  { t: "ABSOLUTELY COOKED 🔥", c: "oklch(0.62 0.24 28)" },
  { t: "FRIED 🍳", c: "oklch(0.74 0.2 55)" },
  { t: "COOKED 🥵", c: "oklch(0.78 0.18 70)" },
  { t: "ALMOST COOKED ⚠️", c: "oklch(0.85 0.16 95)" },
  { t: "SAFE ✨", c: "oklch(0.78 0.16 160)" },
  { t: "RANK #420", c: "oklch(0.7 0.18 320)" },
  { t: "CAUSE: REELS ADDICTION 📱", c: "oklch(0.7 0.18 220)" },
];

export function FloatingChips() {
  const row = [...CHIPS, ...CHIPS];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-6 sm:top-10 overflow-hidden mask-fade"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className="flex gap-3 whitespace-nowrap" style={{ animation: "drift-x 38s linear infinite", width: "max-content" }}>
        {row.map((chip, i) => (
          <span
            key={i}
            className="text-[0.6rem] sm:text-xs font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full glass"
            style={{ color: chip.c, borderColor: `${chip.c}` }}
          >
            {chip.t}
          </span>
        ))}
      </div>
    </div>
  );
}
