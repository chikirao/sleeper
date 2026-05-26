export const FALL_ASLEEP_MINUTES = 15;
export const SLEEP_CYCLE_MINUTES = 90;
export const DISPLAY_CYCLES = [1, 2, 3, 4, 5, 6, 7] as const;
export const RECOMMENDED_CYCLES = new Set<number>([5, 6]);

export type CycleCount = (typeof DISPLAY_CYCLES)[number];

export interface CycleResult {
  cycle: CycleCount;
  time: Date;
}

const clockFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function formatClock(date: Date): string {
  return clockFormatter.format(date);
}

export function parseTimeValue(value: string, baseDate = new Date()): Date {
  const [hours, minutes] = value.split(":").map(Number);
  const parsed = new Date(baseDate);
  parsed.setHours(hours, minutes, 0, 0);
  return parsed;
}

export function getTimeInputValue(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getCycleLabel(cycle: number): string {
  if (cycle === 1) {
    return "1 цикл";
  }

  if (cycle >= 2 && cycle <= 4) {
    return `${cycle} цикла`;
  }

  return `${cycle} циклов`;
}

export function calculateWakeTimes(sleepTime: Date): CycleResult[] {
  return DISPLAY_CYCLES.map((cycle) => ({
    cycle,
    time: addMinutes(sleepTime, FALL_ASLEEP_MINUTES + cycle * SLEEP_CYCLE_MINUTES),
  }));
}

export function calculateSleepTimes(wakeTime: Date): CycleResult[] {
  return [...DISPLAY_CYCLES].reverse().map((cycle) => ({
    cycle,
    time: addMinutes(wakeTime, -(FALL_ASLEEP_MINUTES + cycle * SLEEP_CYCLE_MINUTES)),
  }));
}
