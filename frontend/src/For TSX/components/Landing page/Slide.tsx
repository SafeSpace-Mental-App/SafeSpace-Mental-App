import { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import { useNavigate } from "react-router-dom";

const Slide = () => {
  const SlideObject = [
    {
      image: "/images/FirstLanding.png",
      title: "Vent Safely",
      text: "Share your thoughts anonymously without fear of judgment",
      button: "GET STARTED",
    },
    {
      image: "/images/journal.png",
      title: "Reflect Daily",
      text: "Track your moods and keep a privatejournal for self-reflection",
    },
    {
      image: "/images/Coversation2.png",
      title: "Get Support",
      text: "Access crisis hotlines or trained listeners when you need it most",
    },
  ]; 
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SlideObject.length);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SlideObject.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [SlideObject.length]);

  return (
    <>
      <LandingPage
        backgroundImage={SlideObject[currentSlide].image}
        title={SlideObject[currentSlide].title}
        text={SlideObject[currentSlide].text}
        activeSlide={currentSlide}
        totalSlide={SlideObject.length}
        onClick={handleNextSlide}
        primaryButton={{
          label: "GET STARTED",
          onClick: () => navigate("/getstarted"),
        }}
      />
    </>
  );
};
export default Slide;
