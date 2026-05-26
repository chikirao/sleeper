import { PointerEvent, TouchEvent, useMemo, useRef, useState } from "react";
import { useNowClock } from "../../hooks/useNowClock";
import { useRuntimeEnvironment } from "../../hooks/useRuntimeEnvironment";
import {
  calculateSleepTimes,
  calculateWakeTimes,
  formatClock,
  getTimeInputValue,
  parseTimeValue,
} from "../../utils/time";
import { BottomActions } from "./BottomActions";
import { CycleList } from "./CycleList";
import { InfoBlock } from "./InfoBlock";
import { TimePickerPanel } from "./TimePickerPanel";
import { CalculatorMode } from "./types";

export function SleepCalculator() {
  const now = useNowClock();
  const runtimeEnvironment = useRuntimeEnvironment();
  const [mode, setMode] = useState<CalculatorMode>("now");
  const [sleepInput, setSleepInput] = useState(() => getTimeInputValue(now));
  const [wakeInput, setWakeInput] = useState("07:30");
  const [confirmedSleepInput, setConfirmedSleepInput] = useState(sleepInput);
  const [confirmedWakeInput, setConfirmedWakeInput] = useState(wakeInput);
  const edgeSwipeStart = useRef<{ x: number; y: number } | null>(null);

  const results = useMemo(() => {
    if (mode === "sleep") {
      return calculateSleepTimes(parseTimeValue(confirmedWakeInput, now));
    }

    if (mode === "wake") {
      return calculateWakeTimes(parseTimeValue(confirmedSleepInput, now));
    }

    return calculateWakeTimes(now);
  }, [confirmedSleepInput, confirmedWakeInput, mode, now]);

  const subtitle = mode === "now" ? "если лечь сейчас" : mode === "wake" ? "если лечь в" : "чтобы встать в";
  const baseTime =
    mode === "now" ? formatClock(now) : mode === "wake" ? confirmedSleepInput : confirmedWakeInput;

  const handleModeChange = (nextMode: CalculatorMode) => {
    setMode(nextMode);
  };

  const startEdgeSwipe = (x: number, y: number) => {
    if (mode === "now") {
      return;
    }

    edgeSwipeStart.current = x <= 28 ? { x, y } : null;
  };

  const finishEdgeSwipe = (x: number, y: number) => {
    const start = edgeSwipeStart.current;
    edgeSwipeStart.current = null;

    if (!start || mode === "now") {
      return;
    }

    const deltaX = x - start.x;
    const deltaY = Math.abs(y - start.y);

    if (deltaX >= 72 && deltaY <= 48) {
      setMode("now");
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    startEdgeSwipe(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];
    finishEdgeSwipe(touch.clientX, touch.clientY);
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    startEdgeSwipe(event.clientX, event.clientY);
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    finishEdgeSwipe(event.clientX, event.clientY);
  };

  return (
    <main
      className={`app-shell app-shell--${runtimeEnvironment}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {mode !== "now" && (
        <button className="back-button" type="button" onClick={() => setMode("now")}>
          назад
        </button>
      )}
      <section className="calculator" aria-labelledby="app-title">
        <header className="calculator__header">
          <h1 id="app-title">Sleeper</h1>
        </header>

        {mode !== "now" && (
          <TimePickerPanel
            mode={mode}
            value={mode === "wake" ? sleepInput : wakeInput}
            onValueChange={mode === "wake" ? setSleepInput : setWakeInput}
            onSubmit={() => {
              if (mode === "wake") {
                setConfirmedSleepInput(sleepInput);
              } else {
                setConfirmedWakeInput(wakeInput);
              }
            }}
          />
        )}

        <section className="result-heading" aria-live="polite">
          <p>{subtitle}</p>
          <time dateTime={baseTime}>{baseTime}</time>
        </section>

        <CycleList results={results} />
        <InfoBlock />
        <BottomActions activeMode={mode} onModeChange={handleModeChange} />
      </section>
    </main>
  );
}
