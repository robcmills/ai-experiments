import React, { useEffect, useRef } from 'react';
import { XorNetwork } from 'components/Xor/XorNetwork';
import { NetworkVisualizer } from 'network/NetworkVisualizer';
import { defaultNeatParams } from 'neat/NeatParams';

function run(xorNetwork: XorNetwork, visualizer: NetworkVisualizer) {
  console.log('xorNetwork', xorNetwork);
  visualizer.visualize(xorNetwork.network, defaultNeatParams);
  xorNetwork.run();
}

export function Xor() {
  const parentRef = useRef();
  const networkVisRef = useRef<NetworkVisualizer>();
  const xorNetworkRef = useRef<XorNetwork>();
  useEffect(() => {
    if (parentRef.current) {
      networkVisRef.current = new NetworkVisualizer(parentRef.current);
      xorNetworkRef.current = new XorNetwork();
      run(xorNetworkRef.current, networkVisRef.current);
    }
  }, [parentRef]);
  return <div ref={parentRef} />;
}
