// Bird.jsx
import { useEffect, useRef, useState } from "react";
import { constants } from "./store";
import styled from "styled-components";

const BirdSprite = styled.div`
  position: absolute;
  left: ${constants.BIRD_OFFSET}px;
  top: ${props => props.position}px;
  width: 34px;
  height: 24px;
  background: url("/img/bird-${props => props.state}.png") no-repeat center/contain;
  transition:
    top 0.2s ease-out,
    transform 0.1s ease-out;
  transform: ${props =>
    props.rotate
      ? `rotate(${props.position > props.prevPosition ? Math.min((props.position - props.prevPosition) / 2, 45) : -35}deg)`
      : "rotate(0deg)"};
`;

export default function Bird({ position, gameStarted, gameOver }) {
  const [birdState, setBirdState] = useState("flat");
  const prevPosition = useRef(position);

  useEffect(() => {
    if (!gameStarted || gameOver) {
      const animate = () => {
        setBirdState(prev => (prev === "flat" ? "up" : prev === "up" ? "down" : "flat"));
      };
      const interval = setInterval(animate, 300);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameOver) {
      prevPosition.current = 300;
      setBirdState("flat");
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      setBirdState(position > prevPosition.current ? "down" : "up");
      setTimeout(() => setBirdState("flat"), 200);
    }
    prevPosition.current = position;
  }, [position, gameStarted, gameOver]);

  return <BirdSprite position={position} state={birdState} rotate={gameStarted} prevPosition={prevPosition.current} />;
}
