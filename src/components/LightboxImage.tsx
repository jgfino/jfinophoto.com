"use client";

import useInteractionObserver from "@/hooks/useInteractionObserver";
import Image from "next/image";
import { useRef, useState } from "react";

interface LightboxImageProps {
  className?: string;
  width: number;
  height: number;
  src: string;
  grayed?: boolean;
  hoverText?: string;

  animateClassName?: string;
}

export function LightboxImage({
  className,
  width,
  height,
  src,
  grayed,
  hoverText,
  animateClassName,
}: LightboxImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useInteractionObserver({
    ref,
    animateClass: animateClassName || "",
    enabled: !!animateClassName && loaded,
    repeat: true,
  });

  return (
    <div
      ref={ref}
      key={src}
      className={`relative group h-full hover:cursor-pointer ${
        grayed ? "opacity-50" : ""
      } ${className}`}
    >
      <Image
        onLoad={() => setLoaded(true)}
        alt="alt"
        src={src}
        height={height}
        width={width}
        style={{ objectFit: "cover", height: "100%" }}
      />
      {hoverText && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-center p-2 hidden group-hover:block">
          <span className="text-white text-md">{hoverText}</span>
        </div>
      )}
    </div>
  );
}
