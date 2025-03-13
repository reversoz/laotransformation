"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StarEvents } from "@/components/Stars";

export default function ResultPage() {
  const router = useRouter();
  const [transformedNfts, setTransformedNfts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1); // Start from 1 to show first 3 images
  const [isLoaded, setIsLoaded] = useState(false);
  const baseUri = process.env.NEXT_PUBLIC_NEW_IMAGE_BASE_URI;

  const handleHomeClick = () => {
    StarEvents.resetStars();
    router.push("/");
  };

  const handleDisconnect = () => {
    StarEvents.resetStars();
    localStorage.removeItem("selectedNfts");
    router.push("/");
  };

  useEffect(() => {
    const stored = localStorage.getItem("selectedNfts");
    if (stored) {
      setTransformedNfts(JSON.parse(stored));

      // Start stars animation
      StarEvents.animateToCenter();

      // Listen for animation completion
      const handleAnimationComplete = () => {
        setIsLoaded(true);
      };

      document.addEventListener(
        "STARS_ANIMATION_COMPLETE",
        handleAnimationComplete
      );

      return () => {
        document.removeEventListener(
          "STARS_ANIMATION_COMPLETE",
          handleAnimationComplete
        );
      };
    }
  }, []);

  const handleScroll = (direction) => {
    if (direction === "next") {
      setCurrentIndex(
        (prev) => Math.min(prev + 1, transformedNfts.length - 2) // Stop 2 before end
      );
    } else {
      setCurrentIndex((prev) => Math.max(1, prev - 1)); // Stop at 1
    }
  };

  // Get new image URL using the correct pattern
  const getNewImageUrl = (nftId) => {
    const number = nftId.toString().replace(/\D/g, "");
    return `${baseUri}${number}.png`;
  };

  // Get visible NFTs (always 3)
  const getVisibleNfts = () => {
    if (transformedNfts.length < 3) return transformedNfts;

    return [
      transformedNfts[currentIndex - 1],
      transformedNfts[currentIndex],
      transformedNfts[currentIndex + 1],
    ];
  };

  const visibleNfts = getVisibleNfts();

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-8 z-50">
        <button
          onClick={handleHomeClick}
          className="px-8 py-2 rounded-full border-2 border-white/50 hover:bg-white/10 transition-all text-white text-lg">
          HOME
        </button>
        <button
          onClick={handleDisconnect}
          className="px-8 py-2 rounded-full border-2 border-white/50 hover:bg-white/10 transition-all text-white text-lg">
          DISCONNECT
        </button>
      </div>

      {/* Main Content */}
      <div className="h-screen flex items-center justify-center px-20">
        <div className="w-full max-w-6xl">
          {/* Navigation Arrows and Images */}
          <div className="relative flex items-center justify-center gap-8">
            {/* Left Arrow */}
            {currentIndex > 1 && (
              <button
                onClick={() => handleScroll("prev")}
                className="absolute left-0 -translate-x-16 text-white/50 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Images with animation */}
            <div className="flex justify-center gap-8 overflow-hidden">
              {getVisibleNfts().map((nft, index) => (
                <div
                  key={index}
                  className={`w-80 h-80 relative transition-all duration-700
                    ${index === 1 ? "scale-110 z-10" : "scale-90 opacity-80"}
                    ${
                      !isLoaded
                        ? index === 0
                          ? "-translate-x-[200%]"
                          : index === 2
                          ? "translate-x-[200%]"
                          : "opacity-0 scale-50"
                        : "translate-x-0 opacity-80"
                    }
                  `}>
                  {nft && (
                    <img
                      src={getNewImageUrl(nft.id)}
                      alt={nft.name}
                      className="w-full h-full object-cover rounded-lg"
                      draggable="false"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            {currentIndex < transformedNfts.length - 2 && (
              <button
                onClick={() => handleScroll("next")}
                className="absolute right-0 translate-x-16 text-white/50 hover:text-white transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Progress Dots with animation */}
          <div className="flex justify-center gap-2 mt-8">
            {transformedNfts.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-700
                  ${currentIndex === i ? "bg-white w-8" : "bg-white/30 w-2"}
                  ${!isLoaded ? "opacity-0 scale-0" : "opacity-100 scale-100"}
                `}
                style={{
                  transitionDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
