import { CalculatorMode } from "./types";

interface BottomActionsProps {
  activeMode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
}

export function BottomActions({ activeMode, onModeChange }: BottomActionsProps) {
  return (
    <nav className="bottom-actions" aria-label="Режимы расчета">
      <button
        className={activeMode === "wake" ? "mode-button mode-button--active" : "mode-button"}
        type="button"
        onClick={() => onModeChange("wake")}
      >
        Пробуждение
      </button>
      <button
        className={activeMode === "sleep" ? "mode-button mode-button--active" : "mode-button"}
        type="button"
        onClick={() => onModeChange("sleep")}
      >
        Засыпание
      </button>
    </nav>
  );
}
