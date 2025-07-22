const InputBox = () => {
  return (
    <textarea
      className="h-auto min-h-[300px] rounded-[14px] border-[1px] border-[#000000]/[0.08] bg-[#FFFFFF]/[0.5] px-[14px] py-[14px] text-[16px] text-black transition-transform duration-300 hover:scale-[1.005] focus:outline-none"
      name=""
      id=""
      onChange={(e) => {
        console.log(e);
      }}
    ></textarea>
  );
};

export default InputBox;
