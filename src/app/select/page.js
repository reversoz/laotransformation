"use client";

import { useWallet } from "@/context/WalletContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageCard from "@/components/ImageCard";
import SelectedImagesBar from "@/components/SelectedImagesBar";
import { getNFTsForCollection } from "@/services/nftService";

export default function SelectPage() {
  const { account, isConnected } = useWallet();
  const router = useRouter();
  const [selectedNfts, setSelectedNfts] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
      return;
    }

    async function fetchNFTs() {
      setIsLoading(true);
      try {
        const userNFTs = await getNFTsForCollection(account);
        setNfts(userNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNFTs();
  }, [isConnected, account, router]);

  const handleNftSelect = (nftId) => {
    setSelectedNfts((prev) => {
      if (prev.includes(nftId)) {
        return prev.filter((id) => id !== nftId);
      } else {
        return [...prev, nftId];
      }
    });
  };

  const handleContinue = () => {
    router.push("/transform");
  };

  if (!isConnected) {
    return null;
  }

  return (
    <main className="relative z-10 min-h-screen pb-36">
      <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center">
        <button
          onClick={() => router.push("/")}
          className="bg-transparent hover:bg-white hover:text-gray-700 text-white border-2 border-white font-bold py-2 px-6 rounded-full transition-colors duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer">
          GO BACK
        </button>
        <p className="text-white font-mono">
          {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      </div>

      <div className="text-center text-white pt-24 container mx-auto">
        <h1 className="text-4xl font-bold mb-12">Select Your NFTs</h1>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center">
            <p className="text-xl">No NFTs found in this collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 max-w-6xl mx-auto p-4">
            {nfts.map((nft) => (
              <ImageCard
                key={nft.id}
                imageUrl={nft.imageUrl}
                isSelected={selectedNfts.includes(nft.id)}
                onClick={() => handleNftSelect(nft.id)}
                name={nft.name}
              />
            ))}
          </div>
        )}
      </div>

      <SelectedImagesBar
        selectedNfts={selectedNfts}
        nfts={nfts}
        onContinue={handleContinue}
      />
    </main>
  );
}
