import { useMemo, useState } from "react";
import { useNowClock } from "../../hooks/useNowClock";
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
  const [mode, setMode] = useState<CalculatorMode>("now");
  const [sleepInput, setSleepInput] = useState(() => getTimeInputValue(now));
  const [wakeInput, setWakeInput] = useState("07:30");
  const [confirmedSleepInput, setConfirmedSleepInput] = useState(sleepInput);
  const [confirmedWakeInput, setConfirmedWakeInput] = useState(wakeInput);

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

  return (
    <main className="app-shell">
      <section className="calculator" aria-labelledby="app-title">
        <header className="calculator__header">
          <h1 id="app-title">Sleeper</h1>
          {mode !== "now" && (
            <button className="back-button" type="button" onClick={() => setMode("now")}>
              назад
            </button>
          )}
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
