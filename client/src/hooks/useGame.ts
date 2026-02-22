import { useEffect, useState } from "react";
import { cashOut, createSession, roll } from "../api/api";

export function useGame() {
  const [credits, setCredits] = useState(0);
  const [slot, setSlot] = useState(["x", "x", "x"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startGame() {
      try {
        const session = await createSession();
        setCredits(session.credits);
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
      setSlot(result.combination);
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
      await cashOut();
      setCredits(0);
      setSlot(["x", "x", "x"]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
    return {
      credits,
      slot,
      loading,
      error,
      handleRoll,
      handleCashOut,
    };
  }
}
