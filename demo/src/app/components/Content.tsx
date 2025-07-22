"use client";

import { useEffect, useState } from "react";

import Footer from "./Footer";
import TokenizerContent from "./TokenizerContent";

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
      <TokenizerContent />
      <div className="h-[60px] w-full" />
      <Footer />
      <div className="h-[100px] w-full" />
    </div>
  );
};
