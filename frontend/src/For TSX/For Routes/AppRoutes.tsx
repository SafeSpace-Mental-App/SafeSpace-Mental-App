import { Routes, Route } from "react-router-dom";
import GetStartedPage from "../../For JSX/For Pages/GetStartedPage";
import Onboarding from "../../For JSX/For Pages/Onboarding";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🌟 Onboarding pages */}
      <Route path="/get-started" element={<GetStartedPage />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* 🧩 Other routes go below */}
      {/* <Route path="/signup" element={<Signupform />} /> */}
      {/* <Route path="/signin" element={<AuthForm mode="signin" />} /> */}
    </Routes>
  );
};

export default AppRoutes;
