import React, { useEffect, useState } from 'react';
import { RandomVisualizer } from 'components/Random/RandomVisualizer';

export function Random() {
  const [anchor, setAnchor] = useState<HTMLDivElement>();
  useEffect(() => {
    if (anchor) {
      new RandomVisualizer(anchor).run();
    }
  }, [anchor]);
  return <div ref={setAnchor} />;
}
