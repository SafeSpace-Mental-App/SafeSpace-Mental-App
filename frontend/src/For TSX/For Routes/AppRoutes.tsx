import { Route, Routes } from "react-router-dom";
import FeedPage from "../For pages/FeedPage";
import JournalPage from "../For pages/JournalPage";
import MoodPage from "../For pages/MoodPage";
import SupportPage from "../For pages/SupportPage";
import Signupform from "../components/Auth/Signupform";
import Signinform from "../components/Auth/Signinform";
import VerifyEmail from "../components/Auth/VerifyEmail";
import CongratulationPage from "../components/Auth/CongratulationPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/mood" element={<MoodPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/signup" element={<Signupform />} />
      <Route path="/signin" element={<Signinform />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/congratulationspage" element={<CongratulationPage />} />
    </Routes>
  );
};

export default AppRoutes;
