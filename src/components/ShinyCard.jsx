import React from 'react'
import '../style/ShinyCard.css'

export default function ShinyCard({ children, cardId }) {
  const handleMouseMove = (e) => {
    const card = document.getElementById(`card-${cardId}`);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((x / rect.width) - 0.5) * 30;
    const rotateY = ((0.5 - y / rect.height)) * 30;
    card.style.setProperty('--rotateX', `${rotateX}deg`);
    card.style.setProperty('--rotateY', `${rotateY}deg`);
    card.classList.add('mouse-move');
  };

  const handleMouseLeave = () => {
    const card = document.getElementById(`card-${cardId}`);
    if (!card) return;
    card.style.setProperty('--rotateX', `0deg`);
    card.style.setProperty('--rotateY', `0deg`);
    card.classList.remove('mouse-move');
  };

  return (
    <div
      id={`card-${cardId}`}
      className="homepage-card shiny-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
