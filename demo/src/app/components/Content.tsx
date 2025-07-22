"use client";

import { useEffect, useState } from "react";

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
      className={`absolute top-[16vh] left-1/2 z-1 w-full max-w-[880px] -translate-x-1/2 transform text-black ${paddingClass}`}
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
          {/* input  */}
          <textarea
            className="min-h-[300px] resize-none rounded-[14px] border-[1px] border-[#000000]/[0.08] bg-[#FFFFFF]/[0.5] px-[14px] py-[14px] text-[14px] text-black transition-all duration-300 hover:scale-[1.005] focus:outline-none"
            name=""
            id=""
            onChange={(e) => {
              console.log(e);
            }}
          ></textarea>

          {/*  show whitespace button */}
          <div></div>
        </div>
        <div className="flex w-9/20 flex-col gap-[15px]">
          {/* highlighted  */}
          <div></div>

          {/*  tokenized */}
          <div></div>
        </div>
      </div>
    </div>
  );
};
