import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import "../style/Podium.css";

const PodiumModal = ({ results, onClose }) => {
  const [gold, silver, bronze] = results;

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "9999"; // 모달보다 위
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });

    myConfetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.2 },
    });

    return () => {
      document.body.removeChild(canvas);
    };
  }, []);

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // 모달 내부 클릭 시 닫히지 않도록 막음
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {/* Spotlight */}
      <div className="spotlight" />

      {/* Podium */}
      <div className="podium" onClick={handleModalClick}>
        {/* Silver */}
        <div className="podium-item">
          <img src={silver.menuImage} className="podium-image silver" />
          <div className="podium-rank silver-rank">2위</div>
          <span className="podium-label">
            {silver.truckName} ({silver.voteCount}표)
          </span>
        </div>

        {/* Gold */}
        <div className="podium-item">
          <img src={gold.menuImage} className="podium-image gold" />
          <div className="podium-rank gold-rank">1위</div>
          <span className="podium-label">
            {gold.truckName} ({gold.voteCount}표)
          </span>
        </div>

        {/* Bronze */}
        <div className="podium-item">
          <img src={bronze.menuImage} className="podium-image bronze" />
          <div className="podium-rank bronze-rank">3위</div>
          <span className="podium-label">
            {bronze.truckName} ({bronze.voteCount}표)
          </span>
        </div>
      </div>

      {/* Close Button */}
      <button onClick={onClose} className="close-button">×</button>
    </div>
  );
};

export default PodiumModal;
