"use client";

import { WalletProvider } from "@/context/WalletContext";
import Stars from "./Stars";
import { useEffect, useState } from "react";

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WalletProvider>
      <Stars />
      {children}
    </WalletProvider>
  );
}
