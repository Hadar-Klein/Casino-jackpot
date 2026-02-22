interface SlotCellProps {
  value: string;
}

export function SlotCell({ value }: SlotCellProps) {
  return (
    <div
      style={{
        width: "60px",
        height: "60px",
        border: "1px solid black",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontFamily: "Times New Roman, Times, serif",
      }}
    >
      {value}
    </div>
  );
}
