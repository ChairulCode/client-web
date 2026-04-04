import { useEffect, useState } from "react";
import "./welcome.css";
import { welcomeData } from "../../data";

const Welcome = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const welcomeSection = document.querySelector(
        ".welcome-section",
      ) as HTMLElement;
      if (!welcomeSection) return;

      const rect = welcomeSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const isInView =
        rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2;

      if (isInView && !isVisible) {
        setIsLeaving(false);
        setIsVisible(true);
        setHasBeenVisible(true);
      } else if (!isInView && isVisible && hasBeenVisible) {
        setIsLeaving(true);
        setIsVisible(false);
        setTimeout(() => {
          setIsLeaving(false);
        }, 2000);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible, hasBeenVisible]);

  return (
    <section
      className={`welcome-section relative flex items-center justify-center min-h-screen px-6 sm:px-8 md:px-12 lg:px-20 py-12 overflow-hidden ${
        isVisible ? "is-visible" : ""
      } ${isLeaving ? "is-leaving" : ""}`}
    >
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>
      <div className="bg-circle bg-circle-3"></div>

      <div className="relative max-w-6xl text-center z-10 space-y-8">
        <div className="welcome-heading-container">
          <h1 className="welcome-heading">
            <span className="welcome-emoji">{welcomeData.headingEmoji}</span>
            <br />
            <span className="welcome-title gradient-text">
              {welcomeData.headingMain}
            </span>
            <br />
            <span className="welcome-subtitle">{welcomeData.headingSub}</span>
          </h1>
        </div>

        <div className="welcome-divider flex items-center justify-center gap-6 my-8">
          <div className="divider-line"></div>
          <div className="divider-dot"></div>
          <div className="divider-line divider-line-center"></div>
          <div className="divider-dot divider-dot-small"></div>
          <div className="divider-line"></div>
        </div>

        <div className="welcome-description-container">
          <div className="flex justify-center px-4 sm:px-6 md:px-8">
            <p className="welcome-desc">
              {welcomeData.description}
              <span className="welcome-highlight">{welcomeData.highlight}</span>
              <span className="welcome-footer">
                Kiranya sekolah dan orang tua dapat bekerjasama secara maksimal
                dalam mendidik anak kita sehingga berguna bagi anak kita menuju
                masa depan lebih baik. Semoga bermanfaat!
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
