import { useEffect, useState } from "react";
import { cashOut, createSession, roll } from "../api/api";

export function useGame() {
  const [credits, setCredits] = useState(10);
  const [slots, setSlots] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    async function startGame() {
      try {
        const session = await createSession();
        console.log(session);
        setCredits(session.credits);
        setActive(true);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    startGame();
  }, []);

  async function handleRoll() {
    try {
      setLoading(true);
      setError(null);

      const result = await roll();
      setSlots(result.combination);
      setCredits(result.credits);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCashOut() {
    try {
      setLoading(true);
      setError(null);
      const payout = await cashOut();
      setCredits(0);
      setActive(false);
      setSlots(["", "", ""]);
      return payout.payout;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }
  return {
    credits,
    slots,
    loading,
    error,
    active,
    handleRoll,
    handleCashOut,
  };
}
