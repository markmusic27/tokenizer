import { BaseBox } from "./BaseBox";

interface IndicatorProps {
  title: string;
  data: string;
  className?: string;
}

const Indicator = ({ title, data, className }: IndicatorProps) => {
  return (
    <BaseBox className={`flex flex-col ${className} gap-[4px]`}>
      <p
        className="font-helvetica text-[14px] font-[300]"
        style={{
          WebkitTextStroke: "0.5px #000000",
        }}
      >
        {title}
      </p>
      <p className="text-[18px] font-[500]">{data}</p>
    </BaseBox>
  );
};

export default Indicator;
