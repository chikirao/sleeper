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
  const symbols = ["*", "*", "*", "*", "*", "*", "+", "+"];

  return Array.from({ length: 21 }, (_, id) => {
    const x = 2 + ((id * 31 + (id % 5) * 13) % 95);
    const lowerEdge = x > 72 ? 78 : x < 26 ? 56 : 48;
    const rawY = (id * 19 + (id % 7) * 6) % lowerEdge;

    return {
      id,
      symbol: symbols[id % symbols.length],
      x,
      y: 3 + rawY,
      size: 40 + ((id * 7) % 30),
      opacity: 1,
      duration: 3.2 + (id % 8) * 0.42,
      delay: -(id % 17) * 0.31,
      drift: ((id % 7) - 3) * 0.42,
    };
  });
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
