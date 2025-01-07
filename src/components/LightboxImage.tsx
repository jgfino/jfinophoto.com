"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface LightboxImageProps {
  index?: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: "contain" | "cover";
  src: string;
  grayed?: boolean;
  hoverText?: string;
  animated?: "fade" | "full";
}

export function LightboxImage({
  index,
  className,
  width,
  height,
  fill,
  src,
  grayed,
  hoverText,
  animated,
}: LightboxImageProps) {
  const [loaded, setLoaded] = useState(false);

  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        setInitializing(false);
      }, 200);
    }
  }, [loaded]);

  useEffect(() => {
    setInitializing(true);
  }, [index]);

  const { ref, inView } = useInView({
    skip: !loaded || initializing,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      key={src}
      className={`relative group h-full hover:cursor-pointer ${
        animated && !inView
          ? `opacity-0 blur-sm ${
              animated === "full" ? "translate-y-4 scale-95" : ""
            }`
          : `opacity-100 blur-none translate-y-0 scale-100 motion-reduce:transition-none duration-1000`
      } ${grayed ? "opacity-50" : ""} ${className}`}
    >
      <Image
        onLoad={() => setLoaded(true)}
        alt="alt"
        src={src}
        height={height}
        width={width}
        fill={!!fill}
        style={{ objectFit: fill, height: "100%" }}
      />
      {hoverText && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-center p-2 hidden group-hover:block">
          <span className="text-white text-md">{hoverText}</span>
        </div>
      )}
    </div>
  );
}
