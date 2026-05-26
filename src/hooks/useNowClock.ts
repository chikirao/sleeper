import { useEffect, useState } from "react";

export function useNowClock(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timeoutId = 0;
    let intervalId = 0;

    const refresh = () => setNow(new Date());
    const startMinuteTimer = () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);

      const delayToNextMinute = 60_000 - (Date.now() % 60_000) + 150;
      timeoutId = window.setTimeout(() => {
        refresh();
        intervalId = window.setInterval(refresh, 60_000);
      }, delayToNextMinute);
    };

    const refreshAndReschedule = () => {
      refresh();
      startMinuteTimer();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshAndReschedule();
      }
    };

    refreshAndReschedule();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", refreshAndReschedule);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", refreshAndReschedule);
    };
  }, []);

  return now;
}
