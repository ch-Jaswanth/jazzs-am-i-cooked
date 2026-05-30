import { useEffect } from "react";
import { X } from "lucide-react";

export function DeveloperLog({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-strong border border-accent/30 animate-scale-in"
        style={{ boxShadow: "0 0 80px -10px oklch(0.74 0.2 55 / 0.4)" }}
      >
        {/* Scanlines + glitch header */}
        <div className="relative px-6 sm:px-8 pt-6 pb-4 border-b border-border overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 3px)" }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="text-[0.65rem] uppercase tracking-[0.3em] text-accent font-bold mb-2 font-mono">
            // SYSTEM :: secret_route_143.log
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display glitch" data-text="🥚 Developer Log Unlocked">
            🥚 Developer Log Unlocked
          </h2>
        </div>

        <div className="px-6 sm:px-8 py-6 space-y-5 text-sm sm:text-base leading-relaxed text-foreground/90 font-mono">
          <p>Hey.</p>
          <p>Looks like you found the secret.</p>
          <p>
            If you're wondering why <span className="text-accent font-bold">143</span>...
            well, there isn't really a deep reason. I just needed a number that almost nobody would enter accidentally.
          </p>
          <p>Since you're here, here's a little behind-the-scenes look.</p>

          <div>
            <div className="text-xs uppercase tracking-wider text-accent font-bold mb-2">👨‍💻 About this project</div>
            <p>
              This website was built by <span className="text-gradient-fire font-bold">Jazz</span>, a first-year CS student
              who thought it would be funny to calculate how cooked students are before exams.
            </p>
            <p className="mt-2">What started as a random idea somehow turned into an actual public website.</p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-accent font-bold mb-2">🔥 Fun Facts</div>
            <ul className="space-y-1.5">
              <li>• Spent way too many hours tweaking the cooked score formula.</li>
              <li>• Spent even more time thinking of roasts.</li>
              <li>• Rewrote half the jokes because they sounded funnier in my head.</li>
              <li>• Tested the website on friends and discovered most of them were absolutely cooked.</li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-accent font-bold mb-2">🍳 Why I made this</div>
            <p>Because every student has that moment where they wonder:</p>
            <p className="mt-2 pl-4 border-l-2 border-accent/50 italic">
              "Am I actually prepared... or am I completely cooked?"
            </p>
            <p className="mt-2">Instead of stressing about it, I turned it into a website.</p>
          </div>

          <p>If you're reading this, thanks for taking the time to find the Easter egg.</p>
          <p className="text-foreground font-bold">Now go finish those chapters.</p>

          <div className="border-t border-border pt-5 mt-5">
            <p>If this website called you cooked...</p>
            <p className="mt-2">Just remember.</p>
            <p className="mt-2 text-gradient-fire font-bold">
              I had to build the whole thing instead of studying.
            </p>
            <p className="mt-4 text-right">— Jazz 🍳</p>
          </div>
        </div>
      </div>
    </div>
  );
}
