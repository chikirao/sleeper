import { useEffect, useState } from "react";

type RuntimeEnvironment = "mobile" | "standalone" | "desktop-browser";

function getRuntimeEnvironment(): RuntimeEnvironment {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

  if (isStandalone) {
    return "standalone";
  }

  const isTouchPrimary = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const isNarrow = window.matchMedia("(max-width: 719px)").matches;

  return isTouchPrimary || isNarrow ? "mobile" : "desktop-browser";
}

export function useRuntimeEnvironment() {
  const [environment, setEnvironment] = useState<RuntimeEnvironment>(() => getRuntimeEnvironment());

  useEffect(() => {
    const queries = [
      window.matchMedia("(display-mode: standalone)"),
      window.matchMedia("(display-mode: fullscreen)"),
      window.matchMedia("(hover: none), (pointer: coarse)"),
      window.matchMedia("(max-width: 719px)"),
    ];

    const handleChange = () => setEnvironment(getRuntimeEnvironment());

    queries.forEach((query) => query.addEventListener("change", handleChange));
    window.addEventListener("resize", handleChange);

    return () => {
      queries.forEach((query) => query.removeEventListener("change", handleChange));
      window.removeEventListener("resize", handleChange);
    };
  }, []);

  return environment;
}
