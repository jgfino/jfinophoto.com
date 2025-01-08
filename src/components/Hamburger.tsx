"use client";

import lottie, { AnimationItem } from "lottie-web";
import * as HamburgerAnimation from "../animations/Hamburger.json";
import { useEffect, useRef } from "react";

interface HamburgerProps {
  open: boolean;
  onClick: () => void;
}

export default function Hamburger({ open, onClick }: HamburgerProps) {
  const hamburger = useRef<HTMLDivElement>(null);
  const animation = useRef<AnimationItem>(null);

  useEffect(() => {
    if (hamburger.current) {
      animation.current = lottie.loadAnimation({
        container: hamburger.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: HamburgerAnimation,
      });

      return () => animation.current?.destroy();
    }
  }, []);

  useEffect(() => {
    animation.current?.playSegments(open ? [0, 11] : [12, 22], true);
  }, [open]);

  return (
    <div
      role="button"
      onClick={onClick}
      className="hamburger w-8 h-8 text-black"
      ref={hamburger}
    />
  );
}
