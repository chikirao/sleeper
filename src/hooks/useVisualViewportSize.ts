import { useEffect } from "react";

const DEFAULT_APP_HEIGHT = "100dvh";
const DEFAULT_APP_WIDTH = "100vw";

function updateViewportVariables() {
  const viewport = window.visualViewport;
  const width = Math.round(viewport?.width ?? window.innerWidth);
  const height = Math.round(viewport?.height ?? window.innerHeight);

  document.documentElement.style.setProperty("--app-width", `${width}px`);
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}

export function useVisualViewportSize() {
  useEffect(() => {
    updateViewportVariables();

    const scheduleUpdate = () => {
      window.requestAnimationFrame(updateViewportVariables);
    };

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);
    window.addEventListener("pageshow", scheduleUpdate);
    window.addEventListener("focus", scheduleUpdate);
    document.addEventListener("visibilitychange", scheduleUpdate);
    window.visualViewport?.addEventListener("resize", scheduleUpdate);
    window.visualViewport?.addEventListener("scroll", scheduleUpdate);

    return () => {
      document.documentElement.style.setProperty("--app-width", DEFAULT_APP_WIDTH);
      document.documentElement.style.setProperty("--app-height", DEFAULT_APP_HEIGHT);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
      window.removeEventListener("pageshow", scheduleUpdate);
      window.removeEventListener("focus", scheduleUpdate);
      document.removeEventListener("visibilitychange", scheduleUpdate);
      window.visualViewport?.removeEventListener("resize", scheduleUpdate);
      window.visualViewport?.removeEventListener("scroll", scheduleUpdate);
    };
  }, []);
}
