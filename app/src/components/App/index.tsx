import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  app: {
    bottom: 0,
    left: 0,
    position: 'fixed',
    right: 0,
    top: 0,
  },
});

export function App() {
  const s = useStyles();
  return <div className={s.app}>App</div>;
}
