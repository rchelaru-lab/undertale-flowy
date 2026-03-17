import React, { useState, useEffect } from "react";

export default function BattleGame() {
  const [player, setPlayer] = useState({ x: 150, y: 150, hp: 100 });
  const [bullets, setBullets] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Spawn bullets
  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prev) => [
        ...prev,
        {
          x: Math.random() * 300,
          y: 0,
          speed: 2 + Math.random() * 3,
        },
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Move bullets + collision
  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y + b.speed }))
          .filter((b) => b.y < 300)
      );

      setBullets((prev) => {
        return prev.map((b) => {
          if (
            Math.abs(b.x - player.x) < 15 &&
            Math.abs(b.y - player.y) < 15
          ) {
            setPlayer((p) => {
              const newHp = p.hp - 5;
              if (newHp <= 0) setGameOver(true);
              return { ...p, hp: newHp };
            });
          }
          return b;
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [player]);

  // Controls
  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      setPlayer((p) => {
        let { x, y } = p;
        if (e.key === "ArrowUp") y -= 10;
        if (e.key === "ArrowDown") y += 10;
        if (e.key === "ArrowLeft") x -= 10;
        if (e.key === "ArrowRight") x += 10;
        return {
          ...p,
          x: Math.max(0, Math.min(300, x)),
          y: Math.max(0, Math.min(300, y)),
        };
      });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-xl mb-2">Flowey-Style Battle</h1>
      <div className="relative w-[300px] h-[300px] border-2 border-white">
        {/* Player */}
        <div
          className="absolute w-4 h-4 bg-red-500 rounded-full"
          style={{ left: player.x, top: player.y }}
        />

        {/* Bullets */}
        {bullets.map((b, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-yellow-400 rounded-full"
            style={{ left: b.x, top: b.y }}
          />
        ))}
      </div>

      <p className="mt-2">HP: {player.hp}</p>

      {gameOver && <p className="text-red-500 mt-2">GAME OVER</p>}
    </div>
  );
}
