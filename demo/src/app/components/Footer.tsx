import Image from "next/image";

const Footer = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row">
        <p
          className="font-helvetica mr-[5px] text-[14px] font-[300] text-[#A6A6A6]"
          style={{
            WebkitTextStroke: "0.5px #A6A6A6",
          }}
        >
          Built by{" "}
        </p>
        <p
          onClick={() => {
            window.open("https://x.com/markmusic27", "_blank");
          }}
          className="font-helvetica cursor-pointer bg-white/[0.01] text-[14px] font-[300] text-[#636363] transition-all duration-300 hover:text-[#000000]"
          style={{
            WebkitTextStroke: "0.5px #636363",
          }}
        >
          Mark Music
        </p>
      </div>
      <div className="flex flex-row gap-[18px]">
        <Image
          src="/content/github.svg"
          alt="github"
          width={24}
          height={24}
          className="cursor-pointer bg-white/[0.01] transition-all duration-300 hover:scale-[1.1]"
          onClick={() => {
            window.open("https://github.com/markmusic27", "_blank");
          }}
        />
        <Image
          src="/content/x.svg"
          alt="x"
          width={24}
          height={24}
          className="cursor-pointer bg-white/[0.01] transition-all duration-300 hover:scale-[1.1]"
          onClick={() => {
            window.open("https://x.com/markmusic27", "_blank");
          }}
        />
      </div>
    </div>
  );
};

export default Footer;
