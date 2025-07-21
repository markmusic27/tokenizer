import Image from "next/image";

export const NavButton = () => {
  return (
    <div className="group flex h-[40px] cursor-pointer flex-row gap-[14px] rounded-[16px] bg-black pr-[18px] pl-[24px] transition-colors duration-300 hover:bg-[#393939]">
      <p
        className="font-helvetica my-auto cursor-pointer text-[16px] font-[300] text-[#F8F8F8]"
        style={{
          WebkitTextStroke: "0.4px white",
        }}
      >
        Train your own
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
