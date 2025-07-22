import { useState } from "react";
import { BaseBox } from "./BaseBox";

interface WhitespaceToggleProps {
  onClick: (active: boolean) => void;
}

const FADE_DURATION = 150; // ms

const WhitespaceToggle = ({ onClick }: WhitespaceToggleProps) => {
  const [active, setActive] = useState(true);
  const [fading, setFading] = useState(false);

  const handleClick = () => {
    setFading(true);
    setTimeout(() => {
      setActive((prev) => !prev);
      setFading(false);
      onClick(active);
    }, FADE_DURATION);
  };

  return (
    <BaseBox
      className="cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      active={active}
      onClick={handleClick}
    >
      <p
        className={`font-helvetica text-center font-[300] text-[16] transition-opacity duration-[${FADE_DURATION}ms] ${fading ? "opacity-20" : "opacity-100"}`}
        style={{
          WebkitTextStroke: "0.6px #000000",
        }}
      >
        {active ? "Show whitespaces" : "Hide whitespaces"}
      </p>
    </BaseBox>
  );
};

export default WhitespaceToggle;
