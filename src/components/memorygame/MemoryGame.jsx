import React, { useEffect, useState } from 'react';
import Card from '../Card/Card';
import "./memoryGame.scss"

function MemoryGame() {
  // Stan początkowy: pusta tablica kart
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const [bestTime, setBestTime] = useState(null);

  // Funkcja do przekształcenia czasu na format MM:SS:SSS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = time % 1000;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
  };


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

  // Funkcja do zresetowania gry
  const resetGame = () => {
    setFlippedCards([]);
    setMatchedCards([]);
    setTimer(0);
    setIsRunning(false);
    if (intervalId) clearInterval(intervalId);
    createDeck();
  };

  // Funkcja do zresetowania najlepszego czasu
  const resetBestTime = () => {
    localStorage.removeItem('bestTime');
    setBestTime(null);
  };

  useEffect(() => {
    createDeck();
    const storedBestTime = localStorage.getItem('bestTime');
    if (storedBestTime) {
      setBestTime(parseInt(storedBestTime, 10));
    }
  }, []);




  useEffect(() => {
    if (isRunning && matchedCards.length === cards.length) {
      setIsRunning(false);
      if (intervalId) clearInterval(intervalId);

      if (!bestTime || timer < bestTime) {
        setBestTime(timer);
        localStorage.setItem('bestTime', timer.toString());
      }
    }
  }, [matchedCards, cards, isRunning, intervalId, timer, bestTime]);

  useEffect(() => {
    let timerId;
    if (isRunning) {
      timerId = setInterval(() => {
        setTimer(prev => prev + 10);
      }, 10);
      setIntervalId(timerId);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning]);

  // Funkcja do odwrócenia kart
  const flipCard = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }

    if (!isRunning) {
      setIsRunning(true);
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
        }, 400);
      }
    }
  };

  return (
    <div className="memory-game">
      
      
      <div className="cards-container">
      <div className="timer">{formatTime(timer)}</div>
      {bestTime !== null && <div className="best-time">{formatTime(bestTime)}</div>}
      <button onClick={resetGame} className="refresh-button">Start Again</button>
      <button  onClick={resetBestTime} className="reset-best-button">Reset Best Time</button>
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