import { useMemo } from "react";

export function Confetti({ count = 60 }: { count?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 6 + 4,
        delay: Math.random() * 0.4,
        duration: Math.random() * 1.4 + 1.6,
        drift: (Math.random() - 0.5) * 280,
        rot: Math.random() * 1080 - 360,
        color: ["var(--ember)", "var(--flame)", "oklch(0.88 0.18 90)", "oklch(0.5 0.02 40)"][i % 4],
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size * 1.4}px`,
            background: b.color,
            animation: `confetti-fall ${b.duration}s cubic-bezier(.2,.6,.4,1) ${b.delay}s forwards`,
            // @ts-expect-error CSS vars
            "--cx": `${b.drift}px`,
            "--cr": `${b.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}
