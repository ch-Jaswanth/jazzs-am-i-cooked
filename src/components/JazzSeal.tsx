export function JazzSeal() {
  const text = "JUDGED · BY · JAZZ · CERTIFIED · ROAST · ";
  const chars = text.split("");
  return (
    <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0">
      <div className="absolute inset-0 spin-slow">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <path id="seal-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text fill="currentColor" className="text-accent" style={{ fontSize: 9.5, letterSpacing: "0.05em", fontFamily: "var(--font-display)", fontWeight: 700 }}>
            <textPath href="#seal-circle">{chars.join("")}</textPath>
          </text>
        </svg>
      </div>
      <div
        className="absolute inset-3 rounded-full flex items-center justify-center text-2xl border-2"
        style={{
          borderColor: "oklch(0.78 0.18 70 / 0.5)",
          background: "radial-gradient(circle, oklch(0.18 0.015 30), oklch(0.1 0.01 30))",
          boxShadow: "0 0 24px oklch(0.74 0.2 55 / 0.4), inset 0 0 16px oklch(0.62 0.24 28 / 0.3)",
        }}
      >
        🍳
      </div>
    </div>
  );
}
