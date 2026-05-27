import { AsciiSkyBackground } from "../components/AsciiSkyBackground";
import { SleepCalculator } from "../features/sleep-calculator/SleepCalculator";
import { useVisualViewportSize } from "../hooks/useVisualViewportSize";

export function App() {
  useVisualViewportSize();

  return (
    <>
      <AsciiSkyBackground />
      <SleepCalculator />
    </>
  );
}
