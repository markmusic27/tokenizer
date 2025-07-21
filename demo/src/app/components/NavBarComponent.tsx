"use client";

import { useState } from "react";

interface NavBarComponentProps {
  text: string;
  default: boolean;
  onClick?: () => void;
}

export const NavBarComponent = (props: NavBarComponentProps) => {
  const [isHovering, setIsHovering] = useState(props.default);

  return (
    <div
      className="flex cursor-pointer flex-row items-center gap-[6px] transition-all"
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(props.default);
      }}
      onClick={props.onClick}
    >
      <div
        className={`h-[6px] w-[6px] rounded-full transition-all duration-200 ${
          isHovering ? "scale-100 bg-black" : "scale-0 bg-transparent"
        }`}
      />
      <p
        className={`font-helvetica text-[16px] font-[300] transition-colors ${
          !isHovering ? "text-[#565656]" : "text-black"
        }`}
        style={{
          WebkitTextStroke: !isHovering ? "0.5px #565656" : "0.5px black",
        }}
      >
        {props.text}
      </p>
    </div>
  );
};
