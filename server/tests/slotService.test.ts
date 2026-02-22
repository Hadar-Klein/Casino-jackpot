import { SlotMachineService } from "../src/models/slot-machine/slot.service";
import { SlotSymbol } from "../src/models/slot-machine/slot.type";

describe("SlotMachineService", () => {
  let service: SlotMachineService;

  beforeEach(() => {
    service = new SlotMachineService();
  });

  // ─── isWinningCombination ───────────────────────────────────────────────────

  describe("isWinningCombination", () => {
    it("should return true when all symbols are the same", () => {
      expect(service.isWinningCombination(["C", "C", "C"])).toBe(true);
      expect(service.isWinningCombination(["L", "L", "L"])).toBe(true);
      expect(service.isWinningCombination(["O", "O", "O"])).toBe(true);
      expect(service.isWinningCombination(["W", "W", "W"])).toBe(true);
    });

    it("should return false when symbols differ", () => {
      expect(service.isWinningCombination(["C", "L", "O"])).toBe(false);
      expect(service.isWinningCombination(["C", "C", "L"])).toBe(false);
      expect(service.isWinningCombination(["W", "O", "W"])).toBe(false);
    });
  });

  // ─── getReward ──────────────────────────────────────────────────────────────

  describe("getReward", () => {
    it("should return correct reward for each symbol", () => {
      expect(service.getReward("C")).toBe(10);
      expect(service.getReward("L")).toBe(20);
      expect(service.getReward("O")).toBe(30);
      expect(service.getReward("W")).toBe(40);
    });
  });

  // ─── roll ───────────────────────────────────────────────────────────────────

  describe("roll", () => {
    it("should return exactly 3 symbols", () => {
      const result = service.roll();
      expect(result).toHaveLength(3);
    });

    it("should only return valid symbols", () => {
      const validSymbols: SlotSymbol[] = ["C", "L", "O", "W"];
      for (let i = 0; i < 50; i++) {
        const result = service.roll();
        result.forEach((symbol) => {
          expect(validSymbols).toContain(symbol);
        });
      }
    });
  });

  // ─── rollWithCheat — low credits (< 40) ────────────────────────────────────

  describe("rollWithCheat — low credits (< 40)", () => {
    it("should never re-roll when credits are below 40", () => {
      // Force a winning combination every time
      jest.spyOn(service as any, "roll").mockReturnValue(["C", "C", "C"]);

      const rollSpy = jest.spyOn(service as any, "roll");

      // Run many times — roll should only be called once per rollWithCheat
      for (let i = 0; i < 20; i++) {
        service.rollWithCheat(20);
      }

      // Each call to rollWithCheat should call roll exactly once (no cheat)
      expect(rollSpy).toHaveBeenCalledTimes(20);
    });

    it("should return win result with correct reward when credits < 40", () => {
      jest
        .spyOn(service as any, "roll")
        .mockReturnValue(["W", "W", "W"] as SlotSymbol[]);

      const result = service.rollWithCheat(10);

      expect(result.win).toBe(true);
      expect(result.reward).toBe(40);
      expect(result.combination).toEqual(["W", "W", "W"]);
    });
  });

  // ─── rollWithCheat — medium credits (40–60) ────────────────────────────────

  describe("rollWithCheat — medium credits (40–60)", () => {
    it("should re-roll winning result ~30% of the time", () => {
      // Always produce a win on first roll, loss on second roll
      let callCount = 0;
      jest.spyOn(service as any, "roll").mockImplementation(() => {
        callCount++;
        return callCount % 2 === 1
          ? (["C", "C", "C"] as SlotSymbol[])
          : (["C", "L", "O"] as SlotSymbol[]);
      });

      // Force Math.random to always trigger cheat (< 0.3)
      jest.spyOn(Math, "random").mockReturnValue(0.1);

      const result = service.rollWithCheat(50);

      // Should have re-rolled — second roll is a loss
      expect(result.win).toBe(false);
      expect(result.reward).toBe(0);
    });

    it("should NOT re-roll when random is above 30% threshold", () => {
      jest
        .spyOn(service as any, "roll")
        .mockReturnValue(["O", "O", "O"] as SlotSymbol[]);

      // Math.random > 0.3 → no cheat
      jest.spyOn(Math, "random").mockReturnValue(0.5);

      const result = service.rollWithCheat(50);

      expect(result.win).toBe(true);
      expect(result.reward).toBe(30);
    });
  });

  // ─── rollWithCheat — high credits (> 60) ───────────────────────────────────

  describe("rollWithCheat — high credits (> 60)", () => {
    it("should re-roll winning result ~60% of the time", () => {
      let callCount = 0;
      jest.spyOn(service as any, "roll").mockImplementation(() => {
        callCount++;
        return callCount % 2 === 1
          ? (["L", "L", "L"] as SlotSymbol[])
          : (["C", "L", "O"] as SlotSymbol[]);
      });

      // Force Math.random to trigger cheat (< 0.6)
      jest.spyOn(Math, "random").mockReturnValue(0.4);

      const result = service.rollWithCheat(80);

      expect(result.win).toBe(false);
      expect(result.reward).toBe(0);
    });

    it("should NOT re-roll when random is above 60% threshold", () => {
      jest
        .spyOn(service as any, "roll")
        .mockReturnValue(["W", "W", "W"] as SlotSymbol[]);

      // Math.random > 0.6 → no cheat
      jest.spyOn(Math, "random").mockReturnValue(0.8);

      const result = service.rollWithCheat(80);

      expect(result.win).toBe(true);
      expect(result.reward).toBe(40);
    });
  });

  // ─── rollWithCheat — losing rolls ──────────────────────────────────────────

  describe("rollWithCheat — losing rolls", () => {
    it("should never re-roll a losing result regardless of credits", () => {
      const rollSpy = jest
        .spyOn(service as any, "roll")
        .mockReturnValue(["C", "L", "O"] as SlotSymbol[]);

      // Credits above 60 — cheat is active, but only on wins
      service.rollWithCheat(100);

      // Should only have been called once — no re-roll on a loss
      expect(rollSpy).toHaveBeenCalledTimes(1);
    });

    it("should return reward of 0 for a losing combination", () => {
      jest
        .spyOn(service as any, "roll")
        .mockReturnValue(["C", "L", "W"] as SlotSymbol[]);

      const result = service.rollWithCheat(10);

      expect(result.win).toBe(false);
      expect(result.reward).toBe(0);
    });
  });

  // ─── boundary conditions ────────────────────────────────────────────────────

  describe("boundary conditions", () => {
    it("should use 30% cheat at exactly 40 credits", () => {
      jest
        .spyOn(service as any, "roll")
        .mockReturnValue(["C", "C", "C"] as SlotSymbol[]);
      jest.spyOn(Math, "random").mockReturnValue(0.1); // triggers 30% cheat

      const rollSpy = jest.spyOn(service as any, "roll");
      service.rollWithCheat(40);

      expect(rollSpy).toHaveBeenCalledTimes(2); // original + re-roll
    });

    it("should use 30% cheat at exactly 60 credits", () => {
      jest
        .spyOn(service as any, "roll")
        .mockReturnValue(["C", "C", "C"] as SlotSymbol[]);
      jest.spyOn(Math, "random").mockReturnValue(0.1);

      const rollSpy = jest.spyOn(service as any, "roll");
      service.rollWithCheat(60);

      expect(rollSpy).toHaveBeenCalledTimes(2);
    });

    it("should use 60% cheat at 61 credits", () => {
      jest
        .spyOn(service as any, "roll")
        .mockReturnValue(["C", "C", "C"] as SlotSymbol[]);
      // 0.4 is below 0.6 threshold → cheat triggers
      jest.spyOn(Math, "random").mockReturnValue(0.4);

      const rollSpy = jest.spyOn(service as any, "roll");
      service.rollWithCheat(61);

      expect(rollSpy).toHaveBeenCalledTimes(2);
    });

    it("should not cheat at 39 credits", () => {
      jest
        .spyOn(service as any, "roll")
        .mockReturnValue(["C", "C", "C"] as SlotSymbol[]);

      const rollSpy = jest.spyOn(service as any, "roll");
      service.rollWithCheat(39);

      expect(rollSpy).toHaveBeenCalledTimes(1); // no re-roll
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});