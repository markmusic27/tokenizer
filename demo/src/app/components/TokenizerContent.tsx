import InputBox from "./InputBox";
import { BaseBox } from "./BaseBox";
import WhitespaceToggle from "./WhitespaceToggle";
import HighlightedSegments from "./HighlightedSegments";
import TokenizedSegments from "./TokenizedSegments";
import Indicator from "./Indicator";
import { useState } from "react";

const TokenizerContent = () => {
  const [encoded, setEncoded] = useState([]);
  const [decoded, setDecoded] = useState([]);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [showWhitespace, setShowWhitespace] = useState(false);

  return (
    <div className="flex w-full flex-col items-stretch gap-[15px] md:flex-row">
      <div className="flex flex-col gap-[15px] md:w-17/40">
        {/*  input */}
        <InputBox />

        {/*  show whitespace button */}
        <WhitespaceToggle
          onClick={(e) => {
            setShowWhitespace(e);
          }}
        />
      </div>
      <div className="flex flex-col gap-[15px] md:w-23/40">
        {/* indicators */}
        <div className="flex flex-row gap-[15px]">
          <Indicator title="Token Count" data="14" className="w-2/5" />
          <Indicator title="Compression Ratio" data="127%" className="w-3/5" />
        </div>
        {/* highlighted  */}
        <BaseBox className="flex h-auto min-h-[160] flex-col">
          <HighlightedSegments
            showWhitespace={showWhitespace}
            hoveredIndex={highlighted}
            texts={[
              "The ",
              "quick ",
              "brown ",
              "fox ",
              "jumps ",
              "over ",
              "13 ",
              "lazy ",
              "dogs-twice",
              "!",
            ]}
            onHover={(index) => {
              setHighlighted(index === -1 ? null : index);
            }}
          />
        </BaseBox>

        {/*  tokenized */}
        <BaseBox className="flex h-auto min-h-[160] flex-col">
          <TokenizedSegments
            tokens={[1023, 2045, 3567, 4789]}
            onHover={(index) => {
              setHighlighted(index === -1 ? null : index);
            }}
            hoveredIndex={highlighted}
          />
          <div className="flex" />
        </BaseBox>
      </div>
    </div>
  );
};

export default TokenizerContent;
