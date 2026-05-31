const QUOTES = [
  {
    quote: "I got 92% cooked and still passed somehow. Jazz lied. I love him.",
    name: "Rohit",
    sub: "B.Tech, 6th sem",
  },
  {
    quote: "Showed this to my mom. She said 'beta, this is just a website telling the truth.'",
    name: "Ananya",
    sub: "B.Com, 4th sem",
  },
  {
    quote: "Used the calculator. Dropped the subject. 10/10 career advice.",
    name: "Kabir",
    sub: "BBA, 2nd sem",
  },
];

export function Testimonials() {
  return (
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
      {QUOTES.map((q, i) => (
        <figure
          key={i}
          className="glass rounded-2xl p-4 sm:p-5 text-left animate-fade-in"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <div className="text-accent text-xl leading-none mb-2">“</div>
          <blockquote className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
            {q.quote}
          </blockquote>
          <figcaption className="mt-3 flex items-center gap-2">
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-[0.7rem] font-bold"
              style={{ background: "var(--gradient-fire)", color: "oklch(0.1 0 0)" }}
            >
              {q.name[0]}
            </div>
            <div>
              <div className="text-xs font-semibold">{q.name}</div>
              <div className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">{q.sub}</div>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
