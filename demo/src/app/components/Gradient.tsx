"use client";

import React, { useRef, useEffect } from "react";
import { GradientVideo } from "./GradientVideo";

export const Gradient = () => {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  // Synchronize video2 to video1
  useEffect(() => {
    const v1 = videoRef1.current;
    const v2 = videoRef2.current;
    if (!v1 || !v2) return;

    // Helper to sync v2 to v1
    const sync = () => {
      if (Math.abs(v1.currentTime - v2.currentTime) > 0.05) {
        v2.currentTime = v1.currentTime;
      }
      if (v1.paused !== v2.paused) {
        if (v1.paused) v2.pause();
        else v2.play();
      }
    };

    v1.addEventListener("play", sync);
    v1.addEventListener("pause", sync);
    v1.addEventListener("seeked", sync);
    v1.addEventListener("timeupdate", sync);

    // Initial sync
    sync();

    return () => {
      v1.removeEventListener("play", sync);
      v1.removeEventListener("pause", sync);
      v1.removeEventListener("seeked", sync);
      v1.removeEventListener("timeupdate", sync);
    };
  }, []);

  return (
    <div className="absolute top-0 z-0 flex h-full max-h-[700px] w-full flex-row justify-between">
      <GradientVideo className="h-full" videoRef={videoRef1} />
      <GradientVideo className="h-full scale-x-[-1]" videoRef={videoRef2} />
    </div>
  );
};
