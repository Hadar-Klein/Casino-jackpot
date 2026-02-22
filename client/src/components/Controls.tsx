interface ControlsProps {
  onRoll: () => void;
  onCashOut: () => void;
  disabled?: boolean;
}

export function Controls({ onRoll, onCashOut, disabled }: ControlsProps) {
  return (
    <div
      style={{
        marginTop: "20px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        gap: "20px",
      }}
    >
      <button onClick={onRoll} disabled={disabled}>
        Roll
      </button>
      <button onClick={onCashOut} disabled={disabled}>
        Cash Out
      </button>
    </div>
  );
}
