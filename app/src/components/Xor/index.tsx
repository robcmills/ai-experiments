import React, { useEffect, useRef } from 'react';
import { XorNetwork } from 'components/Xor/XorNetwork';
import { NetworkVisualizer } from 'network/NetworkVisualizer';

export function Xor() {
  const parentRef = useRef();
  const networkVisRef = useRef<NetworkVisualizer>();
  const xorNetworkRef = useRef(new XorNetwork());
  console.log('xorNetwork', xorNetworkRef.current);
  useEffect(() => {
    if (parentRef.current) {
      networkVisRef.current = new NetworkVisualizer(parentRef.current);
      networkVisRef.current.visualize(xorNetworkRef.current.network);
    }
  }, [parentRef]);
  return <div ref={parentRef} />;
}
