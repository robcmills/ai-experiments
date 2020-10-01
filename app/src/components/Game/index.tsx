import React, { useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';

import { GameClass } from 'components/Game/GameClass';

const useStyles = createUseStyles({
  canvas: {
    left: 0,
    position: 'fixed',
    top: 0,
  },
});

export function Game() {
  const s = useStyles();
  const canvasRef = useRef(null);
  const gameRef = useRef<GameClass>();

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      gameRef.current = new GameClass({ canvas: canvasRef.current });
    }
  }, [canvasRef]);

  return <canvas className={s.canvas} ref={canvasRef} />;
}
