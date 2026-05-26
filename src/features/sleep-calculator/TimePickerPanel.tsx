import { FormEvent } from "react";
import { CalculatorMode } from "./types";

interface TimePickerPanelProps {
  mode: Exclude<CalculatorMode, "now">;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
}

const modeCopy = {
  wake: {
    title: "Пробуждение",
    label: "укажите, когда планируете лечь",
  },
  sleep: {
    title: "Засыпание",
    label: "укажите, во сколько хотите встать",
  },
};

export function TimePickerPanel({ mode, value, onValueChange, onSubmit }: TimePickerPanelProps) {
  const copy = modeCopy[mode];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="time-panel" onSubmit={handleSubmit}>
      <div className="time-panel__copy">
        <h2>{copy.title}</h2>
        <p>{copy.label}</p>
      </div>
      <label className="time-control">
        <span>время</span>
        <input type="time" value={value} onChange={(event) => onValueChange(event.target.value)} required />
      </label>
      <button className="calculate-button" type="submit">
        Рассчитать
      </button>
    </form>
  );
}
