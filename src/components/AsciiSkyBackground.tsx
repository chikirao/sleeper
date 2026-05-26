import { useEffect, useMemo, useRef, useState } from "react";
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
  blinkDelay: number;
  blinkInterval: number;
  blinkHold: number;
}

function createStarTokens(): StarToken[] {
  const symbols = ["*", "*", "*", "+", "+"];

  return Array.from({ length: 21 }, (_, id) => {
    const x = 2 + ((id * 31 + (id % 5) * 13) % 95);
    const lowerEdge = x > 72 ? 78 : x < 26 ? 56 : 48;
    const rawY = (id * 19 + (id % 7) * 40) % lowerEdge;

    return {
      id,
      symbol: symbols[id % symbols.length],
      x,
      y: 2 + rawY,
      size: 40 + ((id * 9) % 30),
      opacity: 1,
      duration: 40.2 + (id % 8) * 0.42,
      delay: -(id % 17) * 0.31,
      drift: ((id % 7) - 3) * 0.42,
      blinkDelay: 300 + ((id * 977) % 9000),
      blinkInterval: 6500 + ((id * 719) % 8500),
      blinkHold: 900 + ((id * 431) % 2200),
    };
  });
}

export function AsciiSkyBackground() {
  const stars = useMemo(createStarTokens, []);
  const timersRef = useRef<number[]>([]);
  const [visibleStars, setVisibleStars] = useState<boolean[]>(() =>
    stars.map(() => true),
  );

  useEffect(() => {
    const setStarVisibility = (id: number, isVisible: boolean) => {
      setVisibleStars((current) =>
        current.map((visible, starId) => (starId === id ? isVisible : visible)),
      );
    };

    const clearTimers = () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      timersRef.current = [];
    };

    const scheduleBlink = (star: StarToken, delay: number) => {
      const offTimerId = window.setTimeout(() => {
        setStarVisibility(star.id, false);

        const onTimerId = window.setTimeout(() => {
          setStarVisibility(star.id, true);
          scheduleBlink(star, star.blinkInterval);
        }, star.blinkHold);

        timersRef.current.push(onTimerId);
      }, delay);

      timersRef.current.push(offTimerId);
    };

    stars.forEach((star) => scheduleBlink(star, star.blinkDelay));

    const handleResume = () => {
      clearTimers();
      setVisibleStars(stars.map(() => true));
      stars.forEach((star) => scheduleBlink(star, star.blinkDelay));
    };

    document.addEventListener("visibilitychange", handleResume);
    window.addEventListener("focus", handleResume);

    return () => {
      clearTimers();
      document.removeEventListener("visibilitychange", handleResume);
      window.removeEventListener("focus", handleResume);
    };
  }, [stars]);

  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__symbols">
        {stars.map((star) => (
          <span
            className={`sky__symbol${visibleStars[star.id] ? "" : " sky__symbol--off"}`}
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
