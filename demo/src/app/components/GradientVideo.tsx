export const GradientVideo = ({
  className,
  videoRef,
}: {
  className?: string;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}) => {
  return (
    <div className={`relative ${className ?? ""}`}>
      <video
        ref={videoRef}
        src="/content/gradient.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full object-cover"
      />

      <div className="absolute top-0 right-0 h-full w-[50px] bg-gradient-to-r from-[#F8F8F800] to-[#F8F8F8] sm:w-[100px]" />

      <div className="absolute right-0 bottom-0 h-[70px] w-full bg-gradient-to-b from-[#F8F8F800] to-[#F8F8F8]" />
    </div>
  );
};
