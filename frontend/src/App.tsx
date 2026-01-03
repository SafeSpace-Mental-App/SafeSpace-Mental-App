import { BrowserRouter } from "react-router-dom";


import "../Styling/Variable.css";
// import "./App.css";
import AppRoutes from "./For TSX/For Routes/AppRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
