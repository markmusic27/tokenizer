import Image from "next/image";
import { useState, useEffect } from "react";

export const NavButton = () => {
  const [screenWidth, setScreenWidth] = useState<number>(1024); // Default value for SSR

  useEffect(() => {
    // Set initial value on client side
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="group flex h-[40px] cursor-pointer flex-row gap-[14px] rounded-[16px] bg-black pr-[18px] pl-[24px] transition-colors duration-300 hover:bg-[#393939]"
      onClick={() => {
        window.location.href = "https://github.com/markmusic27/tokenizer";
      }}
    >
      <p
        className="font-helvetica my-auto cursor-pointer text-[16px] font-[300] text-[#F8F8F8]"
        style={{
          WebkitTextStroke: "0.4px white",
        }}
      >
        {screenWidth < 768 ? "Train" : "Train your own"}
      </p>
      <Image
        src="/icons/arrow.svg"
        alt="arrow-right"
        width={15}
        height={12}
        className="my-auto transition-transform duration-300 group-hover:translate-x-[4px]"
      />
    </div>
  );
};
