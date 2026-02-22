import { SlotCell } from "./SlotCell";

interface SlotBoardProps {
  board: string[];
}

export function SlotBoard({ board }: SlotBoardProps) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      {board.map((cell, index) => (
        <SlotCell key={index} value={cell} />
      ))}
    </div>
  );
}
