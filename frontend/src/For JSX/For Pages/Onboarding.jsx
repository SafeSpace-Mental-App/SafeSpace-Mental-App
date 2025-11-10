import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";

export default function Onboarding() {
  const slides = useMemo(
    () => [
      {
        img: "https://res.cloudinary.com/dwkptw91p/image/upload/v1762750984/611ff2bf775df418ac07ec4f38d9ba9bd0651bca_izydj8.png",
        title: "Vent Safely",
        text: "Share your thoughts anonymously without fear of judgment.",
      },
      {
        img: "https://res.cloudinary.com/dwkptw91p/image/upload/v1762751045/6713bffaf2cce8be773b3660a305314248897552_dok17t.png",
        title: "Reflect Daily",
        text: "Track your moods and keep a private journal for self-reflection",
      },
      {
        img: "https://res.cloudinary.com/dwkptw91p/image/upload/v1762751089/16a644f5f9da12c2a3b8145436c9a1a74751728f_e2ryxm.png",
        title: "Get Support",
        text: "Access crisis hotlines or trained listeners when you need it most",
      },
      {
        img: "https://res.cloudinary.com/dwkptw91p/image/upload/v1762751129/376ee59d121c1363190c2dc39158351b1fa9958f_vn4sto.png",
        title: "Join SafeSpace, You’re Safe Here!",
        text: "Your data is private. Your voice matters. You are not alone",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const total = slides.length;
  const last = index === total - 1;
  const nav = useNavigate();

  const touchStartX = useRef(null);
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40;
    if (dx < -threshold) setIndex((i) => Math.min(i + 1, total - 1));
    if (dx > threshold) setIndex((i) => Math.max(i - 1, 0));
    touchStartX.current = null;
  };

  const gotoNext = () => setIndex((i) => Math.min(i + 1, total - 1));
  const gotoPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const skip = () => setIndex(total - 1);

  const progress = (index + 1) / total;
  const slide = slides[index];

  return (
    <div className="onboarding-wrapper">
      <div
        className="onb-root"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {!last && (
          <button
            className="onb-skip"
            onClick={() => {
              localStorage.setItem("hasSeenOnboarding", "true");
              nav("/feed");
            }}
          >
            Skip
          </button>
        )}

        <div className="onb-layout">
          <div className="onb-image">
            <img
              src={slide.img}
              alt={slide.title}
              loading="eager"
              decoding="async"
              draggable="false"
            />
          </div>

          <div className="onb-text">
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>

            <div className="onb-progress">
              <div
                className="onb-progress-fill"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className="onb-cta">
              {!last ? (
                <button className="onb-primary" onClick={gotoNext}>
                  Next
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      localStorage.setItem("hasSeenOnboarding", "true");
                      nav("/feed");
                    }}
                    className="onb-primary"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {index > 0 && (
          <button className="onb-nav onb-left" onClick={gotoPrev}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
        )}
        {!last && (
          <button className="onb-nav onb-right" onClick={gotoNext}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </button>
        )}

        <div className="onb-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`onb-dot ${i <= index ? "is-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
