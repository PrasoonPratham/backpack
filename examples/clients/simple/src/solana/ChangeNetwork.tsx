import React, { useMemo, useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

export function NetworkSwitcher() {
  const network = WalletAdapterNetwork.Mainnet;

  interface Chain {
    name: string;
    endpoint: string;
    explorer: string;
  }
  const mainnet: Chain = {
    name: "mainnet",
    endpoint: "https://solana-api.projectserum.com",
    explorer: "https://explorer.solana.com",
  };

  const cascade: Chain = {
    name: "cascade",
    endpoint: "https://api.injective.eclipsenetwork.xyz:8899",
    explorer:
      "https://solscan.io/?cluster=custom&customUrl=https%3A%2F%2Fapi.injective.eclipsenetwork.xyz%2F",
  };

  const [currentNetwork, setCurrentNetwork] = useState(mainnet);

  function handleNetworkChange(network) {
    setCurrentNetwork(network);
  }

  const endpoint = useMemo(() => {
    if (network === "mainnet-beta") {
      return "https://swr.xnfts.dev/rpc-proxy/";
    } else {
      return clusterApiUrl(network);
    }
  }, [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <div>
        <p>Current network: {currentNetwork.name}</p>

        <button onClick={() => handleNetworkChange(mainnet)}>
          Solana Mainnet
        </button>
        <button onClick={() => handleNetworkChange(cascade)}>Cascade</button>

        <ul>
          <li>Endpoint: {currentNetwork.endpoint}</li>
          <li>Explorer: {currentNetwork.explorer}</li>
        </ul>
      </div>
    </ConnectionProvider>
  );
}
