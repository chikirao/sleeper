import { useMemo } from "react";
import type { CSSProperties } from "react";

interface StarToken {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
}

function createStarTokens(): StarToken[] {
  const symbols = ["*", "*", "*", "*", "×", "x", "+", "-", "·", "."];

  return Array.from({ length: 82 }, (_, id) => ({
    id,
    symbol: symbols[id % symbols.length],
    x: (id * 29 + (id % 6) * 11) % 100,
    y: (id * 17 + (id % 9) * 3) % 58,
    size: 11 + ((id * 7) % 9),
    opacity: 1,
    duration: 4.6 + (id % 8) * 0.55,
    delay: -(id % 19) * 0.37,
    drift: ((id % 7) - 3) * 0.6,
  }));
}

export function AsciiSkyBackground() {
  const stars = useMemo(createStarTokens, []);

  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__symbols">
        {stars.map((star) => (
          <span
            className="sky__symbol"
            key={star.id}
            style={
              {
                "--x": `${star.x}%`,
                "--y": `${star.y}%`,
                "--size": `${star.size}px`,
                "--opacity": star.opacity,
                "--duration": `${star.duration}s`,
                "--delay": `${star.delay}s`,
                "--drift": `${star.drift}px`,
              } as CSSProperties
            }
          >
            {star.symbol}
          </span>
        ))}
      </div>
    </div>
  );
}
