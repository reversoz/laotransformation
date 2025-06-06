"use client";

import { useWallet } from "@/context/WalletContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WalletConnect({ customStyle = false }) {
  const { account, isConnected, connectWallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const handleConnect = async () => {
    try {
      setIsConnecting(true);

      // Request network switch to Ethereum Mainnet
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x1" }], // Chain ID for Ethereum Mainnet
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x1",
                    chainName: "Ethereum Mainnet",
                    nativeCurrency: {
                      name: "Ether",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    rpcUrls: ["https://mainnet.infura.io/v3/"],
                    blockExplorerUrls: ["https://etherscan.io/"],
                  },
                ],
              });
            } catch (addError) {
              console.error("Error adding Ethereum Mainnet:", addError);
            }
          }
        }
      }

      await connectWallet();
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const buttonStyles = customStyle
    ? "bg-transparent hover:bg-white hover:text-gray-700 text-white border-2 border-white font-bold py-3 px-12 text-xl rounded-full transition-colors duration-300"
    : `${
        isConnecting ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
      } text-white font-bold py-2 px-4 rounded`;

  return (
    <div className="flex flex-col items-center gap-4">
      {!isConnected ? (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={buttonStyles + " hover:scale-105 hover:shadow-lg hover:cursor-pointer"}>
          {isConnecting ? "Connecting..." : "CONNECT"}
        </button>
      ) : (
        <div className="text-center">
          <p className="text-green-500 font-bold">Connected!</p>
          <p className="text-sm text-white">
            Account: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        </div>
      )}
    </div>
  );
}
