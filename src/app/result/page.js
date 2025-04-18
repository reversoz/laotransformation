"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import gsap from 'gsap';

export default function ResultPage() {
  const router = useRouter();
  const [transformedNfts, setTransformedNfts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1); // Start from 1 to show first 3 images
  const [isLoaded, setIsLoaded] = useState(false);
  const [direction, setDirection] = useState(null);
  

  const baseUri = process.env.NEXT_PUBLIC_NEW_IMAGE_BASE_URI;

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleDisconnect = () => {
    localStorage.removeItem("selectedNfts");
    router.push("/");
  };

  useEffect(() => {
    const stored = localStorage.getItem("selectedNfts");
    if (stored) {
      setTransformedNfts(JSON.parse(stored));
        setIsLoaded(true);
    }
  }, []);

  const handleScroll = (direction) => {
    setDirection(direction);
    
    // Animate current images out
    const images = document.querySelectorAll('.nft-image');
    gsap.to(images, {
      opacity: 0,
      scale: direction === "next" ? 0.8 : 1.2,
      x: direction === "next" ? -100 : 100,
      duration: 0.3,
      stagger: {
        each: 0.1,
        from: direction === "next" ? "start" : "end"
      },
      onComplete: () => {
        // Update index
        setCurrentIndex((prev) => 
          direction === "next" 
            ? Math.min(prev + 1, transformedNfts.length - 2)
            : Math.max(1, prev - 1)
        );
        
        // Animate new images in
        gsap.fromTo(images,
          {
            opacity: 0,
            scale: direction === "next" ? 1.2 : 0.8,
            x: direction === "next" ? 100 : -100
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.4,
            stagger: {
              each: 0.1,
              from: direction === "next" ? "start" : "end"
            }
          }
        );
      }
    });
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


  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-8 z-50">
        <button
          onClick={handleHomeClick}
          className="px-8 py-2 rounded-full border-2 border-white/50 hover:bg-white/10 transition-all text-white text-lg hover:scale-105 hover:shadow-lg hover:cursor-pointer">
          HOME
        </button>
        <button
          onClick={handleDisconnect}
          className="px-8 py-2 rounded-full border-2 border-white/50 hover:bg-white/10 transition-all text-white text-lg hover:scale-105 hover:shadow-lg hover:cursor-pointer">
          DISCONNECT
        </button>
      </div>

      {/* Main Content - Fix the container structure */}
      <div className="h-screen flex items-center justify-center px-20 relative">
        <div className="w-full max-w-6xl flex items-center">
          {/* Left Arrow - Fixed positioning */}
          {currentIndex > 1 && (
            <button
              onClick={() => handleScroll("prev")}
              className="flex-shrink-0 mr-8 text-white/50 hover:text-white transition-colors hover:scale-105 hover:shadow-lg hover:cursor-pointer">
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

          {/* Images Container */}
          <div className="flex-1 flex justify-center items-center gap-8">
            {getVisibleNfts().map((nft, index) => (
              <div
                key={index}
                className={`nft-image w-80 h-80 relative transition-all duration-700
                  ${index === 1 
                    ? getVisibleNfts().length === 3 
                      ? "scale-110 z-10" 
                      : "scale-90 opacity-80" 
                    : "scale-90 opacity-80"
                  }
                  ${!isLoaded 
                    ? index === 0 
                      ? "-translate-x-[200%]" 
                      : index === 2 
                        ? "translate-x-[200%]" 
                        : "opacity-0 scale-50" 
                    : "translate-x-0 opacity-80"
                  }
                `}
              >
                {nft && (
                  <img
                    src={getNewImageUrl(nft.id)}
                    alt={nft.name}
                    className="w-full h-full object-cover rounded-lg shadow-lg transform transition-transform hover:scale-105"
                    draggable="false"
                  />
                )}
                
                {/* Add shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                              opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-150%] 
                              animate-[shine_1.5s_infinite]" />
              </div>
            ))}
          </div>

          {/* Right Arrow - Fixed positioning */}
          {currentIndex < transformedNfts.length - 2 && (
            <button
              onClick={() => handleScroll("next")}
              className="flex-shrink-0 ml-8 text-white/50 hover:text-white transition-colors hover:scale-105 hover:shadow-lg hover:cursor-pointer">
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
      </div>

      {/* Progress Dots */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-2">
        {transformedNfts.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-700
              ${currentIndex === i ? "bg-white w-8" : "bg-white/30 w-2"}
              ${!isLoaded ? "opacity-0 scale-0" : "opacity-100 scale-100"}
              hover:bg-white/80 cursor-pointer
            `}
            style={{
              transitionDelay: `${i * 100}ms`,
            }}
            onClick={() => {
              const direction = i > currentIndex ? "next" : "prev";
              handleScroll(direction);
            }}
          />
        ))}
      </div>
    </div>
  );
}
