import React from "react";

function Card({ card, index, handleClick, isFlipped }) {
  return (
    <div className={`card ${isFlipped ? 'flipped' : ''} ${!isFlipped ? 'hidden' : ''}`}
    onClick={handleClick}
    >
      {isFlipped ? card.symbol : " "}
    </div>
  );
}
export default Card;
