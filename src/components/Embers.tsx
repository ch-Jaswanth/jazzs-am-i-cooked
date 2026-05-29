import { useMemo } from "react";

// Floating embers + ambient smoke background layer
export function Embers({ count = 40 }: { count?: number }) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 12,
        duration: Math.random() * 10 + 8,
        drift: (Math.random() - 0.5) * 120,
        hue: Math.random() > 0.5 ? "var(--ember)" : "var(--flame)",
      })),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Smoke blobs */}
      <div
        className="absolute -top-32 -left-32 h-[40rem] w-[40rem] rounded-full blur-3xl opacity-30 animate-smoke"
        style={{ background: "radial-gradient(circle, oklch(0.62 0.24 28 / 0.4), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-25 animate-smoke"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.18 70 / 0.35), transparent 70%)", animationDelay: "3s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 animate-smoke"
        style={{ background: "radial-gradient(circle, oklch(0.88 0.18 90 / 0.3), transparent 70%)", animationDelay: "6s" }}
      />

      {/* Embers */}
      {embers.map((e) => (
        <span
          key={e.id}
          className="absolute bottom-0 rounded-full animate-float-up"
          style={{
            left: `${e.left}%`,
            width: `${e.size}px`,
            height: `${e.size}px`,
            background: e.hue,
            boxShadow: `0 0 ${e.size * 3}px ${e.hue}`,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
            // @ts-expect-error CSS var
            "--drift": `${e.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
