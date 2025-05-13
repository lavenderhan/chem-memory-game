import React, { useEffect, useState } from "react";
import { generatePairs } from "./utils/generatePairs";
import { firebaseConfig } from "./utils/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

initializeApp(firebaseConfig);
const db = getDatabase();

export default function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);

  useEffect(() => {
    const generated = generatePairs(8);
    setCards(generated);
    setStartTime(Date.now());
  }, []);

  const handleClick = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.pairId)) return;
    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      const [c1, c2] = newFlipped.map(id => cards.find(c => c.id === id));
      if (c1.pairId === c2.pairId) {
        const newMatched = [...matched, c1.pairId];
        setMatched(newMatched);
        if (newMatched.length === cards.length / 2) {
          const duration = Math.floor((Date.now() - startTime) / 1000);
          setTimeTaken(duration);
          push(ref(db, "scores"), { time: duration, timestamp: Date.now() });
        }
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  return (
    <div>
      <h1>Chemistry Memory Game</h1>
      <div className="grid">
        {cards.map(card => (
          <div
            key={card.id}
            className={`card ${flipped.includes(card.id) || matched.includes(card.pairId) ? "flipped" : ""}`}
            onClick={() => handleClick(card)}
          >
            {flipped.includes(card.id) || matched.includes(card.pairId) ? card.value : "?"}
          </div>
        ))}
      </div>
      {timeTaken && <div>完成時間：{timeTaken} 秒</div>}
    </div>
  );
}
