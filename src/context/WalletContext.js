"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { handleMobileWalletConnection } from '@/utils/metamaskMobile';

// Create the context with a default value
const WalletContext = createContext({
  account: "",
  isConnected: false,
  connectWallet: () => Promise.resolve(),
  disconnectWallet: () => {},
});

// Export the provider component
export function WalletProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const connectWallet = async () => {
    if (typeof window === "undefined") return false;

    try {
      // Handle mobile connection
      const shouldProceed = await handleMobileWalletConnection();
      if (!shouldProceed) return false;

      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          return true;
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
    return false;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount("");
          setIsConnected(false);
        }
      });
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
      }
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected,
        connectWallet,
        disconnectWallet: () => {
          setAccount("");
          setIsConnected(false);
        },
      }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
