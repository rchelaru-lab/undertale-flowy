import React, { useState, useEffect } from "react";

export default function BattleGame() {
  const [player, setPlayer] = useState({ x: 150, y: 220, hp: 100 });
  const [bullets, setBullets] = useState([]);
  const [phase, setPhase] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("You feel a strange presence...");

  // PHASE CONTROL
  useEffect(() => {
    if (player.hp < 70 && phase === 1) {
      setPhase(2);
      setMessage("Flowey laughs... attacks get faster!");
    }
    if (player.hp < 40 && phase === 2) {
      setPhase(3);
      setMessage("This isn't even my final form!");
    }
    if (player.hp < 15 && phase === 3) {
      setPhase(4);
      setMessage("...But it refused.");
    }
  }, [player.hp]);

  // SPAWN ATTACKS
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOver) return;

      if (phase === 1) {
        // simple rain
        spawnBullet();
      }

      if (phase === 2) {
        // faster + spread
        spawnBullet();
        spawnBullet();
      }

      if (phase === 3) {
        // circle burst
        for (let i = 0; i < 6; i++) {
          setBullets((prev) => [
            ...prev,
            {
              x: 150,
              y: 100,
              dx: Math.cos((i / 6) * Math.PI * 2) * 2,
              dy: Math.sin((i / 6) * Math.PI * 2) * 2,
            },
          ]);
        }
      }

      if (phase === 4) {
        // FINAL PHASE (HOPE)
        for (let i = 0; i < 10; i++) {
          spawnBullet(true);
        }
      }
    }, 800 - phase * 100);

    return () => clearInterval(interval);
  }, [phase, gameOver]);

  function spawnBullet(fast = false) {
    setBullets((prev) => [
      ...prev,
      {
        x: Math.random() * 300,
        y: 0,
        dx: 0,
        dy: fast ? 5 : 2 + Math.random() * 2,
      },
    ]);
  }

  // MOVE BULLETS
  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prev) =>
        prev
          .map((b) => ({ ...b, x: b.x + (b.dx || 0), y: b.y + (b.dy || 0) }))
          .filter((b) => b.y < 300 && b.x > 0 && b.x < 300)
      );

      setBullets((prev) => {
        return prev.map((b) => {
          if (
            Math.abs(b.x - player.x) < 10 &&
            Math.abs(b.y - player.y) < 10
          ) {
            setPlayer((p) => {
              let dmg = phase === 4 ? 1 : 5;
              const newHp = p.hp - dmg;
              if (newHp <= 0 && phase !== 4) setGameOver(true);
              return { ...p, hp: newHp <= 0 ? 1 : newHp };
            });
          }
          return b;
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [player, phase]);

  // CONTROLS
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
      <h1 className="text-xl mb-2">Flowey Battle</h1>

      <div className="relative w-[300px] h-[300px] border-2 border-white overflow-hidden">
        {/* Flowey image */}
        <img
          src="/flowey.png"
          alt="flowey"
          className="absolute top-2 left-1/2 -translate-x-1/2 w-20 animate-bounce"
        />

        {/* Player */}
        <div
          className="absolute w-3 h-3 bg-red-500 rounded-full"
          style={{ left: player.x, top: player.y }}
        />

        {/* Bullets */}
        {bullets.map((b, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${phase === 4 ? "bg-blue-300" : "bg-yellow-400"}`}
            style={{ left: b.x, top: b.y, width: 6, height: 6 }}
          />
        ))}
      </div>

      <p className="mt-2">HP: {player.hp}</p>
      <p className="text-sm mt-1 italic">{message}</p>

      {gameOver && <p className="text-red-500 mt-2">GAME OVER</p>}

      {/* MUSIC */}
      <audio autoPlay loop>
        <source src={phase === 4 ? "/hope.mp3" : "/megalovania.mp3"} type="audio/mpeg" />
      </audio>
    </div>
  );
}