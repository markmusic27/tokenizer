"use client";

import { GradientVideo } from "./GradientVideo";

export const Gradient = () => {
  return (
    <div className="absolute top-0 z-0 flex h-full max-h-[700px] w-full flex-row justify-between">
      <GradientVideo className="h-full" />
      <GradientVideo className="h-full scale-x-[-1]" />
    </div>
  );
};
