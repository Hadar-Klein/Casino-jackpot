export type SlotSymbol = "C" | "L" | "O" | "W";

export interface SpinResult {
    combination: SlotSymbol[];
    win: boolean;
    reward: number;
}