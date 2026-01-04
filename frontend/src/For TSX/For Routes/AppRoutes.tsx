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
import MySpace from "../My Space/MySpace";
import Slide from "../components/Landing page/Slide";
import GetStartedPage from "../components/Landing page/GetStartedPage";
import ProtectedRoute from "./ProtectedRoute";
import { useState, useEffect } from "react";

const AppRoutes = () => {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  if (showSplash) return <SplashScreen />;
  return (
    <Routes>
      {/* 🌟 Onboarding pages  */}
      <Route path="/" element={<Slide />}></Route>

      {/* GetStartedPage */}
      <Route path="/getstarted" element={<GetStartedPage />}></Route>

      {/* FEED PAGE */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />

      {/* JOURNAL PAGE */}
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

     
      <Route path="/my-space" element={<MySpace />} />
    </Routes>
  );
};

export default AppRoutes;
