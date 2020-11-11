import React, { useEffect, useState } from 'react';
import { NeatDuel } from 'components/Duel/NeatDuel';

export function Duel() {
  const [parent, setParent] = useState();
  useEffect(() => {
    if (parent) {
      new NeatDuel(parent);
    }
  }, [parent]);
  return <div ref={setParent} />;
}
