import { CHEAT_CONFIG, rewards, symbols } from "./slot.constants.js";
import type { SlotSymbol } from "./slot.type.js";

export class SlotMachineService {
  private randomSymbol(): SlotSymbol {
    const index = Math.floor(Math.random() * symbols.length);
    return symbols[index]!;
  }

  roll(): SlotSymbol[] {
    return [this.randomSymbol(), this.randomSymbol(), this.randomSymbol()];
  }
  isWinningCombination(combination: SlotSymbol[]): boolean {
    return combination.every((symbol) => symbol === combination[0]);
  }
  getReward(symbol: SlotSymbol): number {
    return rewards[symbol];
  }

  private shouldCheat(credits: number): boolean {
    let chance = 0;

    if (
      credits >= CHEAT_CONFIG.LOW_THRESHOLD &&
      credits <= CHEAT_CONFIG.HIGH_THRESHOLD
    ) {
      chance = CHEAT_CONFIG.LOW_CHANCE;
    } else if (credits > CHEAT_CONFIG.HIGH_THRESHOLD) {
      chance = CHEAT_CONFIG.HIGH_CHANCE;
    }

    return Math.random() < chance;
  }

  rollWithCheat(credits: number) {
    let combination = this.roll();
    let win = this.isWinningCombination(combination);

    if (win) {
      const shouldRollAgain = this.shouldCheat(credits);
      if (shouldRollAgain) {
        combination = this.roll();
        win = this.isWinningCombination(combination);
      }
    }
    return {
      combination,
      win,
      reward: win ? this.getReward(combination[0]!) : 0,
    };
  }
}
