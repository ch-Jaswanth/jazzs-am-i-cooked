import { useEffect, useState } from "react";

interface Props {
  score: number;
  color: string;
  label: string;
}

export function Gauge({ score, color, label }: Props) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  // Use 75% of circle (arc)
  const arcLength = circumference * 0.75;
  const offset = arcLength - (displayed / 100) * arcLength;

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(eased * score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="relative mx-auto w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]">
      <svg viewBox="0 0 260 260" className="w-full h-full -rotate-[135deg]">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.88 0.18 90)" />
            <stop offset="50%" stopColor="oklch(0.74 0.2 55)" />
            <stop offset="100%" stopColor="oklch(0.62 0.24 28)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle
          cx="130" cy="130" r={radius}
          fill="none"
          stroke="oklch(1 0 0 / 0.06)"
          strokeWidth="18"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        <circle
          cx="130" cy="130" r={radius}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="18"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-7xl sm:text-8xl font-bold tracking-tighter text-gradient-fire font-display">
          {displayed}
          <span className="text-3xl sm:text-4xl align-top">%</span>
        </div>
        <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Cookedness</div>
        <div
          className="mt-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
          style={{ background: `${color} / 0.15`, color, border: `1px solid ${color}` }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
