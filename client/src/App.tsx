import { SlotBoard } from "./components/SlotBoard";
import { Controls } from "./components/Controls";
import { CreditsDisplay } from "./components/CreditsDesplay";
import { useGame } from "./hooks/useGame";
import { useSlotAnimation } from "./hooks/useSlotAnimation";

function App() {
  const game = useGame();
  const animation = useSlotAnimation(game.slots, game.credits);
  const isGameDisabled =
    game.loading || animation.isSpinning || game.credits === 0;

  async function startRoll() {
    if (animation.isSpinning) return;
    animation.startSpin();
    try {
      await game.handleRoll();
    } catch (err) {
      console.log(err);
      animation.setDisplayCredits((prev) => prev + 1);
    }
  }

  async function handleCashOutClick() {
    try {
      const payout = await game.handleCashOut();
      alert(`You cashed out: ${payout} credits`);
      animation.setDisplayCredits(0);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        minWidth: "100vw",
        boxSizing: "border-box",
      }}
    >
      <h1>Casino Jackpot</h1>
      <CreditsDisplay credits={animation.displayCredits} />
      <SlotBoard board={animation.displaySlots} />
      <Controls
        onRoll={startRoll}
        onCashOut={handleCashOutClick}
        disabled={isGameDisabled}
      />
      {!game.active && (
        <button onClick={() => window.location.reload()}>Start New Game</button>
      )}
      {game.error && (
        <div style={{ color: "red", marginTop: "10px" }}>{game.error}</div>
      )}
    </div>
  );
}

export default App;
