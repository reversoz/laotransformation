"use client";

import ClientOnly from "@/components/ClientOnly";
import WalletConnect from "@/components/WalletConnect";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Home() {
  const { isConnected } = useWallet();
  const router = useRouter();

  return (
    <ClientOnly>
      <Header />
      <main className="relative z-10 min-h-screen p-24">
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl md:text-5xl font-bold mb-12 text-white text-center">
            TRANSFORM YOUR OG TO AN OZ
          </h1>
          <div className="flex flex-col items-center gap-6">
            <WalletConnect customStyle={true} />

            {isConnected && (
              <button
                onClick={() => router.push("/select")}
                className="bg-transparent hover:bg-white hover:text-gray-700 text-white border-2 border-white font-bold py-3 px-12 text-xl rounded-full transition-colors duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer">
                START NOW
              </button>
            )}
          </div>
        </div>
      </main>
    </ClientOnly>
  );
}
