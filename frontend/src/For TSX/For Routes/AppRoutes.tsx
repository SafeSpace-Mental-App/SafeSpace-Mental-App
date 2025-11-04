import { Route, Routes } from "react-router-dom";
import FeedPage from "../For pages/FeedPage";
import JournalPage from "../For pages/JournalPage";
import MoodPage from "../For pages/MoodPage";
import SupportPage from "../For pages/SupportPage";
import Signupform from "../components/Auth/Signupform";

import VerifyEmail from "../components/Auth/VerifyEmail";
import CongratulationPage from "../components/Auth/CongratulationPage";
import AuthForm from "../components/Auth/AuthForm";

import GetStartedPage from "../../For JSX/For Pages/GetStartedPage";
import Onboarding from "../../For JSX/For Pages/Onboarding";
import ForgotPasswordMeassage from "../components/Auth/ForgotPasswordMeassage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/mood" element={<MoodPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/signup" element={<Signupform />} />
      <Route path="/forgotMessagepage" element={<ForgotPasswordMeassage />} />
      {/* <Route path="/signin" element={<Signinform />} /> */}
      <Route
        path="/verify-email"
        element={<VerifyEmail mode="verification" />}
      />
      <Route path="/verify-emailreset" element={<VerifyEmail mode="reset" />} />
      <Route
        path="/verificationSuccess"
        element={<CongratulationPage mode="verification" />}
      />
      <Route
        path="/resetSuccess"
        element={<CongratulationPage mode="reset" />}
      />
      {/* ✅ Signin */}
      <Route path="/signin" element={<AuthForm mode="signin" />} />

      {/* ✅ Forgot Password */}
      <Route path="/forgot" element={<AuthForm mode="forgot" />} />

      {/* 🌟 Onboarding pages */}
      <Route path="/get-started" element={<GetStartedPage />} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
};

export default AppRoutes;
