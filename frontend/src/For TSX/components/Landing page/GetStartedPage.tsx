import LandingPage from "./LandingPage";
import { useNavigate } from "react-router-dom";

const GetStartedPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <LandingPage
        backgroundImage="/images/Heart.png"
        title="Join SafeSpace, You’re Safe Here!"
        text="Your data is private. Your voice matters. You are not alone"
        SecondaryButton={{
          label: "Create Your Account",
          onClick: () => navigate("/signup"),
        }}
        TertiaryButton={{
          label: "Sign in",
          onClick: () => navigate("/signin"),
        }}
      />
    </>
  );
};

export default GetStartedPage;
