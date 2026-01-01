import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./For TSX/My Space/For Hooks/useUserProvider";

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
