import React, { useState } from "react";

interface TokenizedSegmentsProps {
  tokens: number[];
  onHover: (index: number) => void;
}

const TokenizedSegments: React.FC<TokenizedSegmentsProps> = ({
  tokens,
  onHover,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleHover = (index: number | null) => {
    setHoveredIndex(index);
    onHover(index ?? -1);
  };

  // Function to generate a color class for each text
  const generateColorClass = (index: number) => {
    const colors = [
      "bg-sky-200",
      "bg-amber-200",
      "bg-blue-200",
      "bg-green-200",
      "bg-orange-200",
      "bg-cyan-200",
      "bg-gray-200",
      "bg-purple-200",
      "bg-indigo-200",
      "bg-lime-200",
      "bg-rose-200",
      "bg-violet-200",
      "bg-yellow-200",
      "bg-emerald-200",
      "bg-zinc-200",
      "bg-red-200",
      "bg-fuchsia-200",
      "bg-pink-200",
      "bg-teal-200",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-row flex-wrap">
      {tokens.map((token, idx) => (
        <span
          key={idx}
          className="inline-block"
          onMouseEnter={() => handleHover(idx)}
          onMouseLeave={() => handleHover(null)}
        >
          <span
            className={`font-mono text-[16px] whitespace-pre transition-all duration-200 ${hoveredIndex === idx ? generateColorClass(idx) : ""}`}
          >
            {token}
          </span>
          {idx < tokens.length - 1 && (
            <span className="font-mono text-[16px] whitespace-pre">, </span>
          )}
        </span>
      ))}
    </div>
  );
};

export default TokenizedSegments;
