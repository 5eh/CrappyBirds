import React, { useCallback, useEffect, useRef, useState } from "react";
import { constants } from "./store";
import styled from "styled-components";

const PipeContainer = styled.div`
  position: absolute;
  width: ${constants.PIPE_WIDTH}px;
  left: ${props => props.position}px;
`;

const TopPipe = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: ${props => props.height}px;
  background: url("/img/top-pipe.png") no-repeat;
  background-size: ${constants.PIPE_WIDTH}px 100%;
`;

const BottomPipe = styled.div`
  position: absolute;
  width: 100%;
  height: ${props => props.height}px;
  top: ${props => props.top}px;
  background: url("/img/bottom-pipe.png") no-repeat;
  background-size: ${constants.PIPE_WIDTH}px 100%;
`;

const CollisionBorder = styled.div`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  /* For debugging:
  background: rgba(255, 0, 0, 0.2);
  */
`;

const COLLISION_BUFFER = 10; // Visual buffer for collision detection
const COLLISION_BORDER_PADDING = 2;

const generateHeight = () => Math.random() * (constants.WINDOW_HEIGHT - constants.PIPE_GAP - 200) + 100;

export default function Pipes({ onScore, onCollision, birdPosition, gameStarted }) {
  const [pipes, setPipes] = useState([]);
  const audioRef = useRef({
    hit: new Audio("/sound-effects/hit.wav"),
    score: new Audio("/sound-effects/point.wav"),
  });
  const frameRef = useRef();
  const visiblePipesCount = Math.ceil((constants.WINDOW_WIDTH + constants.PIPE_SPACING) / constants.PIPE_SPACING) + 1;

  const checkCollision = (pipe, pipePosition) => {
    const birdLeft = constants.BIRD_OFFSET + COLLISION_BUFFER;
    const birdRight = constants.BIRD_OFFSET + 34 - COLLISION_BUFFER;
    const birdTop = birdPosition + COLLISION_BUFFER;
    const birdBottom = birdPosition + 24 - COLLISION_BUFFER;

    // Only check collision if bird is visually inside the pipe
    const pipeLeft = pipePosition + COLLISION_BORDER_PADDING;
    const pipeRight = pipePosition + constants.PIPE_WIDTH - COLLISION_BORDER_PADDING;

    if (birdRight < pipeLeft || birdLeft > pipeRight) {
      return false;
    }

    const topPipeBottom = pipe.height - COLLISION_BORDER_PADDING;
    if (birdTop < topPipeBottom) {
      return true;
    }

    const bottomPipeTop = pipe.height + constants.PIPE_GAP + COLLISION_BORDER_PADDING;
    if (birdBottom > bottomPipeTop) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (gameStarted) {
      setPipes(
        Array.from({ length: visiblePipesCount }, (_, i) => ({
          id: i,
          position: constants.WINDOW_WIDTH + constants.PIPE_SPACING * i,
          height: generateHeight(),
          scored: false,
        })),
      );
    } else {
      setPipes([]);
      cancelAnimationFrame(frameRef.current);
    }
  }, [gameStarted, visiblePipesCount]);

  useEffect(() => {
    if (!gameStarted) return;

    const updatePipes = () => {
      setPipes(currentPipes => {
        const updatedPipes = currentPipes
          .filter(pipe => pipe.position > -constants.PIPE_WIDTH)
          .map(pipe => {
            const newPosition = pipe.position - constants.PIPE_VELOCITY;

            if (birdPosition !== constants.DEFAULT_BIRD_Y && checkCollision(pipe, newPosition)) {
              audioRef.current.hit.play();
              onCollision();
            }

            if (!pipe.scored && newPosition < constants.BIRD_OFFSET - constants.PIPE_WIDTH) {
              audioRef.current.score.play();
              onScore();
              pipe.scored = true;
            }

            return { ...pipe, position: newPosition };
          });

        // Add new pipes if needed
        const rightmostPipe = Math.max(...updatedPipes.map(p => p.position));
        if (rightmostPipe < constants.WINDOW_WIDTH + constants.PIPE_SPACING) {
          updatedPipes.push({
            id: Date.now(), // Unique ID for each new pipe
            position: rightmostPipe + constants.PIPE_SPACING,
            height: generateHeight(),
            scored: false,
          });
        }

        return updatedPipes;
      });
      frameRef.current = requestAnimationFrame(updatePipes);
    };

    frameRef.current = requestAnimationFrame(updatePipes);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameStarted, birdPosition]);

  return (
    <>
      {pipes.map(pipe => (
        <PipeContainer key={pipe.id} position={pipe.position}>
          <TopPipe height={pipe.height} />
          <BottomPipe
            top={pipe.height + constants.PIPE_GAP}
            height={constants.WINDOW_HEIGHT - pipe.height - constants.PIPE_GAP}
          />
          <CollisionBorder
            width={constants.PIPE_WIDTH - COLLISION_BORDER_PADDING * 2}
            height={pipe.height - COLLISION_BORDER_PADDING}
            top={0}
            left={COLLISION_BORDER_PADDING}
          />
          <CollisionBorder
            width={constants.PIPE_WIDTH - COLLISION_BORDER_PADDING * 2}
            height={constants.WINDOW_HEIGHT - pipe.height - constants.PIPE_GAP}
            top={pipe.height + constants.PIPE_GAP + COLLISION_BORDER_PADDING}
            left={COLLISION_BORDER_PADDING}
          />
        </PipeContainer>
      ))}
    </>
  );
}
