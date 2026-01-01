import { Route, Routes } from "react-router-dom";
import FeedPage from "../components/Feed Component/FeedPage";
import JournalPage from "../components/Journal Component/JournalPage";
import MoodPage from "../components/Mood log Component/MoodLogPage";
import SupportPage from "../For pages/SupportPage";
import Signupform from "../components/Auth/Signupform";

import VerifyEmail from "../components/Auth/VerifyEmail";
import CongratulationPage from "../components/Auth/CongratulationPage";
import AuthForm from "../components/Auth/AuthForm";

import ForgotPasswordMeassage from "../components/Auth/ForgotPasswordMeassage";
import SplashScreen from "../For pages/SplashSCreen";
// import Onboarding2 from "../../Dummy Folder/Onboarding2";
import MySpace from "../My Space/MySpace";
import Slide from "../components/Landing page/Slide";
import GetStartedPage from "../components/Landing page/GetStartedPage";

// import LandingPage from "../components/Landing page/LandingPage";
// import Onboarding2 from "../../Dummy Folder/Onboarding2";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/journal" element={<JournalPage />} />
      {/* Mood */}
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

      {/* <Route path="/onboarding2" element={<Onboarding2 />} />
       */}
      <Route path="/my-space" element={<MySpace />} />

      {/* 🌟 Onboarding pages  */}
      <Route path="/onboarding" element={<Slide />}></Route>

      {/* GetStartedPage */}
      <Route path="/getstarted" element={<GetStartedPage />}></Route>
    </Routes>
  );
};

export default AppRoutes;
