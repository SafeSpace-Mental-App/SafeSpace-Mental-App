import { Route, Routes } from "react-router-dom";
import FeedPage from "../components/Feed Component/FeedPage";
import JournalPage from "../For pages/JournalPage";
import MoodPage from "../components/Mood log Component/MoodLogPage";
import SupportPage from "../For pages/SupportPage";
import Signupform from "../components/Auth/Signupform";

import VerifyEmail from "../components/Auth/VerifyEmail";
import CongratulationPage from "../components/Auth/CongratulationPage";
import AuthForm from "../components/Auth/AuthForm";

import GetStartedPage from "../../For JSX/For Pages/GetStartedPage";
import Onboarding from "../../For JSX/For Pages/Onboarding";
import ForgotPasswordMeassage from "../components/Auth/ForgotPasswordMeassage";
import SplashScreen from "../For pages/SplashSCreen";
// import Onboarding2 from "../../Dummy Folder/Onboarding2";
import MySpace from "../My Space/MySpace";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/mood" element={<MoodPage />} />
      <Route path="/myspace" element={<SupportPage />} />
      <Route path="/signup" element={<Signupform />} />
      <Route path="/forgotMessagepage" element={<ForgotPasswordMeassage />} />

      <Route path="/verify-email" element={<VerifyEmail />} />

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
      {/* <Route path="/onboarding2" element={<Onboarding2 />} />
       */}
      <Route path="/my-space" element={<MySpace />} />
    </Routes>
  );
};

export default AppRoutes;
