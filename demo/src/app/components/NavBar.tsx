"use client";

import Image from "next/image";
import { NavBarComponent } from "./NavBarComponent";
import { NavButton } from "./NavButton";

export const NavBar = () => {
  return (
    <div className="mx-[15px] mt-[20px] flex max-w-[900px] flex-row items-center justify-between rounded-[20px] bg-[#DEDEDE4D] py-[6px] pr-[6px] pl-[15px] backdrop-blur-[24px] lg:mx-auto">
      <Image src="/content/logo.svg" alt="logo" height={20} width={184} />
      <div className="hidden flex-row gap-[18px] md:flex">
        <NavBarComponent
          text="Tokenize"
          default={true}
          onClick={() => {
            console.log("Tokenize");
          }}
        />
        <NavBarComponent
          text="GitHub"
          default={false}
          onClick={() => {
            console.log("GitHub");
          }}
        />
        <NavBarComponent
          text="Report"
          default={false}
          onClick={() => {
            console.log("Report");
          }}
        />
      </div>
      <NavButton />
    </div>
  );
};
