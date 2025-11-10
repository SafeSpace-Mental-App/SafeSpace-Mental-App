import React, { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Dummy Folder/Onboarding2.module.css";

export default function Onboarding2() {
  const slides = useMemo(
    () => [
      {
        img: "https://exciting-blush-berczpvzj5.edgeone.app/611ff2bf775df418ac07ec4f38d9ba9bd0651bca.png",
        title: "Vent Safely",
        text: "Share your thoughts anonymously without fear of judgment.",
      },
      {
        img: "https://subsequent-violet-w1ksv6cfbj.edgeone.app/6713bffaf2cce8be773b3660a305314248897552.png",
        title: "Reflect Daily",
        text: "Track your moods and keep a private journal for self-reflection.",
      },
      {
        img: "https://mental-salmon-hu3fwtaqly.edgeone.app/16a644f5f9da12c2a3b8145436c9a1a74751728f.png",
        title: "Get Support",
        text: "Access crisis hotlines or trained listeners when you need it most.",
      },
      {
        img: "https://miniature-sapphire-iqvqduyzwx.edgeone.app/376ee59d121c1363190c2dc39158351b1fa9958f.png",
        title: "Join SafeSpace, You’re Safe Here!",
        text: "Your data is private. Your voice matters. You are not alone.",
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
  const progress = (index + 1) / total;
  const slide = slides[index];

  return (
    <div className={styles.onboardingWrapper}>
      <div
        className={styles.onbRoot}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {!last && (
          <button
            className={styles.onbSkip}
            onClick={() => {
              localStorage.setItem("hasSeenOnboarding", "true");
              nav("/feed");
            }}
          >
            Skip
          </button>
        )}

        <div className={styles.onbLayout}>
          <div className={styles.onbImage}>
            <img src={slide.img} alt={slide.title} />
            <div className={styles.overlay}></div>
          </div>

          <div className={styles.onbText}>
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>

            <div className={styles.onbProgress}>
              <div
                className={styles.onbProgressFill}
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className={styles.onbCta}>
              {!last ? (
                <button className={styles.onbPrimary} onClick={gotoNext}>
                  Next
                </button>
              ) : (
                <button
                  onClick={() => {
                    localStorage.setItem("hasSeenOnboarding", "true");
                    nav("/feed");
                  }}
                  className={styles.onbPrimary}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>

        {index > 0 && (
          <button
            className={`${styles.onbNav} ${styles.onbLeft}`}
            onClick={gotoPrev}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
        )}
        {!last && (
          <button
            className={`${styles.onbNav} ${styles.onbRight}`}
            onClick={gotoNext}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </button>
        )}

        <div className={styles.onbDots}>
          {slides.map((_, i) => (
            <span
              key={i}
              className={`${styles.onbDot} ${i <= index ? styles.active : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

  {/* Energy Focus Section (small motivation) */}
      <section className={styles.energyBox}>
        <h3>
          <FiSun /> Energy Focus
        </h3>
        <p>
          🌱 Keep your energy where it matters most — protecting your peace and
          growing your joy.
        </p>
        <button className={styles.actionBtn}>
          <FiHeart /> Do One Kind Thing Today
        </button>
      </section>



