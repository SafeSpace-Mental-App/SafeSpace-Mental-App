import styles from "./LandingPage.module.css";

type props = {
  backgroundImage: string;
  title: string;
  text: string;
  onClick?: () => void;
  totalSlide?: number;
  activeSlide?: number;
  primaryButton?: {
    label: string;
    onClick: () => void;
  };
  SecondaryButton?: {
    label: string;
    onClick: () => void;
  };
  TertiaryButton?: {
    label: string;
    onClick: () => void;
  };
};

const LandingPage = ({
  backgroundImage,
  title,
  text,
  onClick,
  primaryButton,
  SecondaryButton,
  TertiaryButton,
  activeSlide,
  totalSlide,
}: props) => {
  return (
    <>
      <div
        className={styles.container}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        onClick={onClick}
      >
        <div className={styles.wordsContainer}>
          <div className={styles.wordsContainerTwo}>
            <p className={styles.heading}>{title}</p>

            <p className={styles.words}>{text}</p>

            {typeof totalSlide === "number" &&
              typeof activeSlide === "number" && (
                <div className={styles.indicator}>
                  {Array.from({ length: totalSlide }).map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.dot} ${
                        index === activeSlide ? styles.activeDot : styles.dot
                      }`}
                    ></span>
                  ))}
                </div>
              )}

            <div>
              {primaryButton && (
                <button
                  className={styles.GetStarted}
                  onClick={primaryButton?.onClick}
                >
                  {primaryButton?.label}
                </button>
              )}
            </div>

            <div className={styles.ButtonsContainer}>
              {SecondaryButton && (
                <button
                  onClick={SecondaryButton.onClick}
                  className={styles.createButton}
                >
                  {" "}
                  {SecondaryButton.label}
                </button>
              )}
              {TertiaryButton && (
                <button
                  onClick={TertiaryButton.onClick}
                  className={styles.SigninButton}
                >
                  {" "}
                  {TertiaryButton.label}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
