"use client";

import { useEffect, useState } from "react";
import InputBox from "./InputBox";
import { BaseBox } from "./BaseBox";
import WhitespaceToggle from "./WhitespaceToggle";
import HighlightedSegments from "./HighlightedSegments";
import TokenizedSegments from "./TokenizedSegments";
import Indicator from "./Indicator";
import Footer from "./Footer";

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
        Minimal implementation of BPE tokenizer for LLMs
      </p>
      <div className="h-[45px] w-full" />
      <div className="flex w-full flex-col items-stretch gap-[15px] md:flex-row">
        <div className="flex flex-col gap-[15px] md:w-17/40">
          {/*  input */}
          <InputBox />

          {/*  show whitespace button */}
          <WhitespaceToggle
            onClick={(active) => {
              console.log("toggle whitespace", active);
            }}
          />
        </div>
        <div className="flex flex-col gap-[15px] md:w-23/40">
          {/* indicators */}
          <div className="flex flex-row gap-[15px]">
            <Indicator title="Token Count" data="14" className="w-2/5" />
            <Indicator
              title="Compression Ratio"
              data="127%"
              className="w-3/5"
            />
          </div>
          {/* highlighted  */}
          <BaseBox className="flex h-auto min-h-[160] flex-col">
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
          <BaseBox className="flex h-auto min-h-[160] flex-col">
            <TokenizedSegments
              tokens={[1023, 2045, 3567, 4789]}
              onHover={(index) => {
                console.log("hover", index);
              }}
            />
            <div className="flex" />
          </BaseBox>
        </div>
      </div>
      <div className="h-[60px] w-full" />
      <Footer />
      <div className="h-[100px] w-full" />
    </div>
  );
};
