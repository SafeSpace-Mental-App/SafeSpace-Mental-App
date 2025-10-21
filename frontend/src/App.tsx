import { BrowserRouter } from "react-router-dom";
import TailwindPratice from "./For TSX/ForTesting";
import "../Styling/Variable.css";
function App() {
  return (
    <>
      <TailwindPratice />
      <BrowserRouter></BrowserRouter>
      <p
        style={{
          backgroundColor: "var(--text-secondary)",
          fontFamily: "var(--font-primary)",
          fontWeight: "var(--weight-semibold)",
          fontSize:'var(--text-body-xl)'
        }}
      >
        Hi
      </p>
    </>
  );
}

export default App;
