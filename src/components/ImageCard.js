"use client";

export default function ImageCard({ imageUrl, onClick, isSelected, name }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300
        hover:scale-105 hover:shadow-2xl
        ${isSelected ? "ring-4 ring-white scale-105" : ""}
      `}>
      <img
        src={imageUrl}
        alt={name || "NFT"}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      <div
        className={`
        absolute inset-0 border-4 border-transparent
        hover:border-white/50 transition-all duration-300
        ${isSelected ? "border-white" : ""}
      `}
      />

      {name && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
          <p className="text-white text-sm truncate">{name}</p>
        </div>
      )}

      {isSelected && (
        <div className="absolute top-2 right-2 bg-white rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-900"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
