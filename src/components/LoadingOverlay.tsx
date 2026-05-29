import { useEffect, useState } from "react";
import { LOADING_MESSAGES } from "@/lib/cooked";

export function LoadingOverlay({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const total = 3200;
    const step = total / LOADING_MESSAGES.length;
    const interval = setInterval(() => {
      setIdx((i) => {
        if (i >= LOADING_MESSAGES.length - 1) {
          clearInterval(interval);
          setTimeout(onDone, 400);
          return i;
        }
        return i + 1;
      });
    }, step);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl animate-fade-in">
      <div className="relative flex flex-col items-center gap-8 px-6 text-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-2 border-border" />
          <div
            className="absolute inset-0 h-24 w-24 rounded-full border-2 border-transparent animate-pulse-glow"
            style={{
              borderTopColor: "var(--flame)",
              borderRightColor: "var(--ember)",
              animation: "spin 1.2s linear infinite, pulse-glow 2s ease-in-out infinite",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🍳</div>
        </div>
        <div className="min-h-[3rem] flex items-center">
          <p key={idx} className="text-lg sm:text-xl font-medium text-foreground animate-fade-in">
            {LOADING_MESSAGES[idx]}
          </p>
        </div>
        <div className="flex gap-1.5">
          {LOADING_MESSAGES.map((_, i) => (
            <div
              key={i}
              className="h-1 w-6 rounded-full transition-all duration-300"
              style={{ background: i <= idx ? "var(--flame)" : "oklch(1 0 0 / 0.1)" }}
            />
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
