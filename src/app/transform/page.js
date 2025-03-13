"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { StarEvents } from "@/components/Stars";

const NEW_CONTRACT_ABI = [
  "function transmit(uint256[] calldata tokenIds) external",
  "function isTransformationPeriodActive() external view returns (bool)",
];

export default function TransformPage() {
  const router = useRouter();
  const [selectedNfts, setSelectedNfts] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const baseUri = process.env.NEXT_PUBLIC_NEW_IMAGE_BASE_URI;

  useEffect(() => {
    const stored = localStorage.getItem("selectedNfts");
    if (stored) {
      setSelectedNfts(JSON.parse(stored));
    }
  }, []);

  const getNewImageUrl = (nftId) => {
    const number = nftId.toString().replace(/\D/g, "");
    return `${baseUri}${number}.png`;
  };

  const updateMetadata = async (tokenIds) => {
    try {
      const response = await fetch("/api/update-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenIds }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update metadata");
      }

      return data;
    } catch (error) {
      console.error("Metadata update error:", error);
      throw error;
    }
  };

  const handleConvert = async () => {
    try {
      setIsConverting(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const newContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_NEW_CONTRACT_ADDRESS,
        NEW_CONTRACT_ABI,
        signer
      );

      // Check if transformation period is active
      const isActive = await newContract.isTransformationPeriodActive();
      if (!isActive) {
        throw new Error("Transformation period has ended");
      }

      // Prepare token IDs array
      const tokenIds = selectedNfts.map((nft) => nft.id.toString());

      // Call transmit function
      const tx = await newContract.transmit(
        tokenIds.map((id) => ethers.BigNumber.from(id))
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        // Get token IDs
        const tokenIds = selectedNfts.map((nft) => nft.id.toString());
        // Update metadata
        await updateMetadata(tokenIds);
        // Start animation and navigation
        StarEvents.animateToCenter();
        setTimeout(() => {
          window.location.href = "/result";
        }, 1500);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Conversion error:", error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen relative text-white">
      {/* Fixed Header with Back button */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-40 p-8">
        <button
          onClick={() => router.push("/select")}
          className="px-8 py-2 rounded-full border-2 border-white/50 hover:bg-white/10 transition-all text-lg">
          BACK
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="pt-28 pb-32 px-8 h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* NFT transformation grid */}
          <div className="space-y-12">
            {selectedNfts.map((nft) => (
              <div
                key={nft.id}
                className="flex items-center justify-center gap-24">
                {/* Original NFT */}
                <div className="w-64 h-64 bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Arrow */}
                <div className="text-white/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>

                {/* New Image */}
                <div className="w-64 h-64 bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={getNewImageUrl(nft.id)}
                    alt="New Image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23EF4444'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='white' text-anchor='middle' alignment-baseline='middle'%3ENEW IMAGE%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Convert Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-50 p-8 flex justify-center">
        <button
          onClick={handleConvert}
          disabled={isConverting}
          className={`px-16 py-4 rounded-full text-2xl font-bold shadow-lg
            ${
              isConverting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-200 transition-all"
            }`}>
          {isConverting ? "TRANSFORMING..." : "TRANSFORM"}
        </button>
      </div>
    </div>
  );
}
