import type { SlotSymbol } from "./slot.type.js";

export const symbols: SlotSymbol[] = ["C", "L", "O", "W"];
export const rewards: Record<SlotSymbol, number> = {
  C: 10,
  L: 20,
  O: 30,
  W: 40,
};

export const CHEAT_CONFIG = {
    LOW_THRESHOLD: 40,
    HIGH_THRESHOLD: 60,
    LOW_CHANCE: 0.3,
    HIGH_CHANCE: 0.6
};