import { useState, useEffect } from "react";

export function useSlotAnimation(slots: string[], credits: number) {
  const [displaySlots, setDisplaySlots] = useState(["", "", ""]);
  const [displayCredits, setDisplayCredits] = useState(credits);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    timeouts.push(
      setTimeout(() => {
        setDisplaySlots((prev) => [slots[0], prev[1], prev[2]]);
      }, 1000),
    );
    timeouts.push(
      setTimeout(() => {
        setDisplaySlots((prev) => [prev[0], slots[1], prev[2]]);
      }, 2000),
    );
    timeouts.push(
      setTimeout(() => {
        setDisplaySlots(slots);
        setDisplayCredits(credits);
        setIsSpinning(false);
      }, 3000),
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [slots]);

  function startSpin() {
    setIsSpinning(true);
    setDisplaySlots(["X", "X", "X"]);
    setDisplayCredits((prev) => prev - 1);
  }

  return {
    displaySlots,
    displayCredits,
    isSpinning,
    startSpin,
    setDisplayCredits,
  };
}
