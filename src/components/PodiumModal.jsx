import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import "../style/Podium.css";

const PodiumModal = ({ results, onClose }) => {
  // results 배열이 비어있거나 유효하지 않은 경우를 처리
  if (!results || results.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="podium" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="close-button">×</button>
          <h2 className="modal-title">🌟 최종 투표 결과 🌟</h2>
          <p className="no-results-message">아직 투표 결과가 없습니다.</p>
        </div>
      </div>
    );
  }


  const [gold, silver, bronze] = results.slice(0, 3); 

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
        {/* Silver - 2위 */}
        {silver ? ( // silver 객체가 존재하는지 먼저 확인
          <div className="podium-item">
            <img 
              src={silver.menus?.[0]?.menuImage || DEFAULT_IMAGE} 
              alt={silver.truckName}
              className="podium-image silver" 
            />
            <div className="podium-rank silver-rank">2위</div>
            <span className="podium-label">
              {silver.truckName} ({silver.voteCount}표)
            </span>
          </div>
        ) : (
          <div className="podium-item placeholder"></div> // 2위가 없을 경우 빈 공간 처리
        )}

        {/* Gold - 1위 */}
        {gold ? ( // gold 객체가 존재하는지 먼저 확인
          <div className="podium-item">
            <img 
              src={gold.menus?.[0]?.menuImage || DEFAULT_IMAGE} 
              alt={gold.truckName}
              className="podium-image gold" 
            />
            <div className="podium-rank gold-rank">1위</div>
            <span className="podium-label">
              {gold.truckName} ({gold.voteCount}표)
            </span>
          </div>
        ) : (
          <div className="podium-item placeholder"></div> 
        )}

        {/* Bronze - 3위 */}
        {bronze ? ( // bronze 객체가 존재하는지 먼저 확인
          <div className="podium-item">
            <img 
              src={bronze.menus?.[0]?.menuImage || DEFAULT_IMAGE} // 옵셔널 체이닝 및 기본 이미지 폴백
              alt={bronze.truckName}
              className="podium-image bronze" 
            />
            <div className="podium-rank bronze-rank">3위</div>
            <span className="podium-label">
              {bronze.truckName} ({bronze.voteCount}표)
            </span>
          </div>
        ) : (
          <div className="podium-item placeholder"></div> // 3위가 없을 경우 빈 공간 처리
        )}
      </div>

      {/* Close Button */}
      <button onClick={onClose} className="close-button">×</button>
    </div>
  );
};

export default PodiumModal;