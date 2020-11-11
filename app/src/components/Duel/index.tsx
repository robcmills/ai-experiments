import React, { useEffect, useState } from 'react';
import { NeatDuel } from 'components/Duel/NeatDuel';

const container = {
  display: 'flex',
};
const canvas = {
  border: '1px solid lightgray',
};

export function Duel() {
  const [parent, setParent] = useState();
  useEffect(() => {
    if (parent) {
      new NeatDuel(parent);
    }
  }, [parent]);
  return (
    <div style={container}>
      <div ref={setParent} style={canvas} />
    </div>
  );
}
