import React, { useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';

import { GameClass } from 'components/Game/GameClass';

const useStyles = createUseStyles({
  canvas: {
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'fixed',
    right: 0,
    top: 0,
    width: '100%',
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
