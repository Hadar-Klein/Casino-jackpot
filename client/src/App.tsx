import { useState } from "react";
import { SlotBoard } from "./components/SlotBoard";
import { Controls } from "./components/Controls";
import { CreditsDisplay } from "./components/CreditsDesplay";

function App() {
  const [credits, setCredits] = useState(10);
  const [slots, setSlots] = useState(["-", "-", "-"]);

  return (
    <div
      style={{
        padding: "40px",
        marginTop: "20px",
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
      <CreditsDisplay credits={credits} />
      <SlotBoard board={slots} />
      <Controls onRoll={() => {}} onCashOut={() => {}} />
    </div>
  );
}

export default App;
