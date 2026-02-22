interface SlotCellProps {
  value: string;
}

export function SlotCell({ value }: SlotCellProps) {
  const isSpinning = value === "X";

  return (
    <div
      style={{
        width: "60px",
        height: "60px",
        border: "2px solid black",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontFamily: "Times New Roman, Times, serif",
      }}
    >
      <div
        style={{
          ...(isSpinning && {
            animation: "spin 0.6s linear infinite",
          }),
        }}
      >
        {value}
      </div>
    </div>
  );
}
