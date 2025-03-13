"use client";

import { useRef, useEffect, useState } from "react";

export default function SelectedImagesBar({ selectedNfts, nfts, onContinue }) {
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [selectedNfts]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setScrollStart(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.clientX;
    const delta = x - dragStart;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollStart - delta;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDragging, dragStart, scrollStart]);

  const updateScrollIndicator = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const scrollProgress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    return Math.min(Math.max(scrollProgress, 0), 100);
  };

  const handleContinue = () => {
    const selectedNftsData = selectedNfts.map((id) => {
      const nft = nfts.find((n) => n.id === id);
      console.log("Found NFT:", nft);
      return {
        id: nft.id,
        name: nft.name,
        imageUrl: nft.imageUrl,
      };
    });
    console.log("Storing data:", selectedNftsData);
    localStorage.setItem("selectedNfts", JSON.stringify(selectedNftsData));

    onContinue();
  };

  if (selectedNfts.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-white/20 z-50 py-6">
      <div className="mx-auto px-8">
        <div className="flex items-center gap-8">
          <div className="flex-1 relative min-w-0">
            {showLeftScroll && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gray-900/80 rounded-full p-2 hover:bg-gray-800 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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

            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto overflow-y-hidden scrollbar-hide px-4 cursor-grab select-none"
                onMouseDown={handleMouseDown}
                onScroll={(e) => {
                  checkScroll();
                  e.currentTarget.style.setProperty(
                    "--scroll-progress",
                    `${updateScrollIndicator()}%`
                  );
                }}>
                <div className="flex items-center gap-6">
                  {selectedNfts.map((id) => {
                    const nft = nfts.find((n) => n.id === id);
                    if (!nft) return null;

                    return (
                      <div
                        key={id}
                        className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-white/50 hover:scale-105 transition-transform duration-200">
                        <img
                          src={nft.imageUrl}
                          alt={nft.name}
                          className="w-full h-full object-cover"
                          draggable="false"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="absolute bottom-[-12px] left-4 right-4 h-[4px] bg-gray-700/80 rounded-full">
                  <div
                    className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    style={{
                      width: "var(--scroll-progress, 0%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {showRightScroll && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gray-900/80 rounded-full p-2 hover:bg-gray-800 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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

          <button
            onClick={handleContinue}
            className="w-48 bg-white text-gray-900 font-bold py-4 px-8 text-xl rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
