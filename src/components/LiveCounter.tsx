import { useEffect, useState } from "react";

export function LiveCounter({ start = 10247 }: { start?: number }) {
  const [n, setN] = useState(start);
  useEffect(() => {
    const id = setInterval(() => setN((v) => v + Math.floor(Math.random() * 3) + 1), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums">{n.toLocaleString()}</span>
  );
}
