import { useRef } from "react";
import { Download, Share2 } from "lucide-react";
import type { Result } from "@/lib/cooked";

interface Props {
  result: Result;
  onShare: (platform: "wa" | "ig") => void;
}

export function ShareCard({ result, onShare }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const download = async () => {
    const node = ref.current;
    if (!node) return;
    // Render the DOM node to canvas using an SVG foreignObject trick (no deps)
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    const xml = new XMLSerializer().serializeToString(node);
    const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">${xml.replace(/&nbsp;/g, " ")}</foreignObject>
    </svg>`;
    const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((b) => {
        if (!b) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = `am-i-cooked-${result.score}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    };
    img.src = url;
  };

  return (
    <div className="space-y-4">
      <div
        ref={ref}
        className="relative mx-auto w-full max-w-md rounded-3xl p-8 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.18 0.02 30), oklch(0.12 0.01 30))",
          border: "1px solid oklch(1 0 0 / 0.1)",
        }}
      >
        <div
          aria-hidden
          className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-50"
          style={{ background: result.level.color }}
        />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              🍳 Am I Cooked?
            </div>
            <div className="text-xs text-muted-foreground">Official Verdict</div>
          </div>

          <div className="text-7xl font-bold tracking-tighter text-gradient-fire font-display leading-none">
            {result.score}%
          </div>
          <div
            className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ background: `${result.level.color}`, color: "oklch(0.1 0 0)" }}
          >
            {result.level.emoji} {result.level.label}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Cause of Death</div>
              <div className="font-semibold mt-0.5">{result.causeOfDeath}</div>
            </div>
            <div>
              <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Class Rank</div>
              <div className="font-semibold mt-0.5">#{result.rank.toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground mb-1">— Jazz</div>
            <p className="text-sm leading-relaxed text-foreground/90">{result.level.roast}</p>
          </div>

          <div className="mt-6 text-[0.65rem] text-muted-foreground text-center">
            amicooked.app
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={download}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-strong text-sm font-medium hover:bg-white/5 transition"
        >
          <Download className="h-4 w-4" /> Download
        </button>
        <button
          onClick={() => onShare("wa")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-strong text-sm font-medium hover:bg-white/5 transition"
        >
          <Share2 className="h-4 w-4" /> WhatsApp
        </button>
        <button
          onClick={() => onShare("ig")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-strong text-sm font-medium hover:bg-white/5 transition"
        >
          <Share2 className="h-4 w-4" /> Instagram
        </button>
      </div>
    </div>
  );
}
