import React, { useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';

import { GameCanvasRenderer } from 'components/Game/GameCanvasRenderer';

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
  const gameRef = useRef<GameCanvasRenderer>();

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      gameRef.current = new GameCanvasRenderer({ canvas: canvasRef.current });
    }
  }, [canvasRef]);

  return <canvas className={s.canvas} ref={canvasRef} />;
}
