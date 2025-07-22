import type { PropsWithChildren, ReactNode } from "react";

interface BaseBoxProps {
  className?: string;
  active?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}

export const BaseBox = ({
  className = "",
  active = true,
  children,
  onClick,
}: BaseBoxProps) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-[14px] border-[1px] border-[#000000]/[0.08] ${active ? "bg-white/[0.5]" : "bg-[#F7F7F7]"} px-[14px] py-[14px] ${className}`}
    >
      {children}
    </div>
  );
};
