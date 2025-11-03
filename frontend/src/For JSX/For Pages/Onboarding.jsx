import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Onboarding() {
  const slides = useMemo(
    () => [
      {
        img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop",
        title: "Your Safe Place",
        text: "Track your mood, journal freely, and get gentle nudges that help you feel better—day by day.",
      },
      {
        img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
        title: "Real Tools, Real Relief",
        text: "Breathing guides, grounding exercises, and quick check-ins when you need them most.",
      },
      {
        img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop",
        title: "Private by Default",
        text: "Your data stays yours. Use an anonymous name anywhere across the app.",
      },
      {
        img: "https://images.unsplash.com/photo-1515165562835-c3b8c2e5d4a5?q=80&w=1600&auto=format&fit=crop",
        title: "Ready to Begin?",
        text: "Create an account in seconds and start your mental wellness journey.",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const total = slides.length;
  const last = index === total - 1;
  const nav = useNavigate();

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, total - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // Touch swipe
  const touchStartX = useRef(null);
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40; // swipe sensitivity
    if (dx < -threshold) setIndex((i) => Math.min(i + 1, total - 1));
    if (dx > threshold) setIndex((i) => Math.max(i - 1, 0));
    touchStartX.current = null;
  };

  const gotoNext = () => setIndex((i) => Math.min(i + 1, total - 1));
  const gotoPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const skip = () => setIndex(total - 1);

  // progress value 0..1
  const progress = (index + 1) / total;

  const slide = slides[index];

  return (
    <div
      className="onb-root"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Skip (hidden on last screen) */}
      {!last && (
        <button
          className="onb-skip"
          onClick={skip}
          aria-label="Skip onboarding"
        >
          Skip
        </button>
      )}

      {/* Image (60%) + Text (40%) */}
      <div className="onb-layout">
        <div className="onb-image">
          <img src={slide.img} alt={slide.title} />
        </div>

        <div className="onb-text">
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>

          {/* Progress bar */}
          <div
            className="onb-progress"
            aria-label="progress"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="onb-progress-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* CTA row */}
          <div className="onb-cta">
            {!last ? (
              <button className="onb-primary" onClick={gotoNext}>
                Next
              </button>
            ) : (
              <Link to="/get-started" className="onb-primary onb-link-btn">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Left/Right arrow buttons (hide left on first, hide right on last) */}
      {index > 0 && (
        <button
          className="onb-nav onb-left"
          onClick={gotoPrev}
          aria-label="Previous"
        >
          {/* left chevron svg */}
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
      )}
      {!last && (
        <button
          className="onb-nav onb-right"
          onClick={gotoNext}
          aria-label="Next"
        >
          {/* right chevron svg */}
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
        </button>
      )}

      {/* Segmented dots (optional + modern look) */}
      <div className="onb-dots" aria-hidden="true">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`onb-dot ${i <= index ? "is-active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
