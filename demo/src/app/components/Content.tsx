"use client";

import { useEffect, useState } from "react";
import InputBox from "./InputBox";
import { BaseBox } from "./BaseBox";
import WhitespaceToggle from "./WhitespaceToggle";
import HighlightedSegments from "./HighlightedSegments";
import TokenizedSegments from "./TokenizedSegments";

export const Content = () => {
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const paddingClass =
    windowWidth !== undefined && windowWidth < 910 ? "px-[15px]" : "px-0";

  return (
    <div
      className={`absolute top-[16vh] left-1/2 z-10 w-full max-w-[880px] -translate-x-1/2 transform text-black ${paddingClass}`}
    >
      <p
        className="font-helvetica text-center text-[32px] font-[300] md:text-[48px]"
        style={{
          WebkitTextStroke: "0.5px #000000",
        }}
      >
        Visual Tokenizer
      </p>
      <div className="h-[5px] w-full"></div>
      <p
        className="font-helvetica px-[18vw] text-center text-[18px] font-[300] text-[#636363] md:px-0 md:text-[22px]"
        style={{
          WebkitTextStroke: "0.6px #636363",
        }}
      >
        A minimal Byte Pair Encoding tokenizer for LLMs
      </p>
      <div className="h-[45px] w-full"></div>
      <div className="flex h-[300px] w-full gap-[15px]">
        <div className="flex w-9/20 flex-col gap-[15px]">
          <InputBox />

          {/*  show whitespace button */}
          <WhitespaceToggle
            onClick={(active) => {
              console.log("toggle whitespace", active);
            }}
          />
        </div>
        <div className="flex w-9/20 flex-col gap-[15px]">
          {/* highlighted  */}
          <BaseBox className="flex flex-row">
            <HighlightedSegments
              showWhitespace={false}
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
                console.log("hover", index);
              }}
            />
          </BaseBox>

          {/*  tokenized */}
          <BaseBox className="flex flex-row">
            <TokenizedSegments
              tokens={[
                1023, 2045, 3567, 4789, 5123, 6789, 7890, 8912, 9345, 10234,
                12345, 14567, 16789, 18901, 20345, 23456, 26789, 29876, 31234,
                34567,
              ]}
              onHover={(index) => {
                console.log("hover", index);
              }}
            />
          </BaseBox>

          <div></div>
        </div>
      </div>
    </div>
  );
};
