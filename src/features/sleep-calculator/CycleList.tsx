import { CycleResult, formatClock, getCycleLabel, RECOMMENDED_CYCLES } from "../../utils/time";

interface CycleListProps {
  results: CycleResult[];
}

export function CycleList({ results }: CycleListProps) {
  return (
    <ol className="cycle-list" aria-label="Результаты по циклам сна">
      {results.map((result) => {
        const isRecommended = RECOMMENDED_CYCLES.has(result.cycle);

        return (
          <li className={isRecommended ? "cycle-row cycle-row--recommended" : "cycle-row"} key={result.cycle}>
            <span>{getCycleLabel(result.cycle)}</span>
            <time dateTime={formatClock(result.time)}>{formatClock(result.time)}</time>
          </li>
        );
      })}
    </ol>
  );
}
