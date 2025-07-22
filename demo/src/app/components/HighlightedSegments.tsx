import React, { useState } from "react";

interface HighlightedSegmentsProps {
  texts: string[];
  onHover: (index: number | null) => void;
  showWhitespace: boolean;
  hoveredIndex?: number | null;
}

const HighlightedSegments: React.FC<HighlightedSegmentsProps> = ({
  texts,
  onHover,
  showWhitespace,
  hoveredIndex: hoveredIndexProp,
}) => {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<
    number | null
  >(null);

  // Use controlled hoveredIndex if provided, otherwise use internal state
  const hoveredIndex =
    hoveredIndexProp !== undefined ? hoveredIndexProp : internalHoveredIndex;

  const handleHover = (index: number | null) => {
    if (hoveredIndexProp === undefined) {
      setInternalHoveredIndex(index);
    }
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

  const containsWhitespace = (text: string) => {
    return text.includes(" ");
  };

  return (
    <div className="flex flex-row flex-wrap">
      {texts.map((text, idx) => (
        <span
          key={idx}
          className={`font-mono ${(showWhitespace || hoveredIndex === idx) && containsWhitespace(text) ? "pl-[0.2px]" : ""} text-[16px] whitespace-pre transition-colors duration-200 ${hoveredIndex === null || hoveredIndex === idx ? generateColorClass(idx) : ""}`}
          onMouseEnter={() => handleHover(idx)}
          onMouseLeave={() => handleHover(null)}
        >
          {showWhitespace || hoveredIndex === idx
            ? text.replace(/ /g, "⋅")
            : text}
        </span>
      ))}
    </div>
  );
};

export default HighlightedSegments;
