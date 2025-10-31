import { BrowserRouter } from "react-router-dom";
import "../Styling/Variable.css";
import AppRoutes from "./For TSX/For Routes/AppRoutes";
import Signupform from "./For TSX/components/Auth/Signupform";
import Signinform from "./For TSX/components/Auth/signinform";
import InputField from "./For TSX/components/ReusableField/InputField";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      {/* <Signinform/> */}
    </>
  );
}

export default App;
