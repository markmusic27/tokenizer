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
      className={`absolute left-1/2 z-1 h-[500px] w-full max-w-[880px] -translate-x-1/2 transform ${paddingClass}`}
    >
      <div className="h-full w-full bg-blue-500"></div>
    </div>
  );
};
