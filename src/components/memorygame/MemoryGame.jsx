import React, { useEffect, useState } from 'react';
import Card from '../Card/Card';
import "./memoryGame.scss"

function MemoryGame() {
  // Stan początkowy: pusta tablica kart
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);




  //Funkcja do stworzenia talii kart
  const createDeck = () => {
    // const cards = [];
    const symbols = ['♦', '♥', '♠', '♣', '★', '●'];
    const numberOfPairs = 6; // Możesz dostosować liczbę par

    let newCards = [];

    // Tworzymy pary kart
    for (let i = 0; i < numberOfPairs; i++) {
      newCards.push({ id: i * 2, symbol: symbols[i], isFlipped: false });
      newCards.push({ id: i * 2 + 1, symbol: symbols[i], isFlipped: false });
    }

    // Mieszamy talię kart
    newCards = newCards.sort(() => Math.random() - 0.5);
    setCards(newCards);
  };



  useEffect(() => {
    createDeck()
  }, [])




  //Funkcja do odwrócenia kart
  const flipCard = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const firstCard = cards[newFlippedCards[0]];
      const secondCard = cards[newFlippedCards[1]];

      if (firstCard.symbol === secondCard.symbol) {
        setMatchedCards([...matchedCards, newFlippedCards[0], newFlippedCards[1]]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };



  return (
    <div className="memory-game">
      <div className="cards-container">
        {cards.map((card, index) => (
          <Card
            className="card"
            key={card.id}
            card={card}
            index={index}
            handleClick={() => flipCard(index)}
            isFlipped={flippedCards.includes(index) || matchedCards.includes(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default MemoryGame;
