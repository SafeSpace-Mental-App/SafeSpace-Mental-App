import { Route, Routes } from "react-router-dom";
import FeedPage from "../For pages/FeedPage";
import JournalPage from "../For pages/JournalPage";
import MoodPage from "../For pages/MoodPage";
import SupportPage from "../For pages/SupportPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/mood" element={<MoodPage />} />
      <Route path="/support" element={<SupportPage />} />
    </Routes>
  );
};

export default AppRoutes;
