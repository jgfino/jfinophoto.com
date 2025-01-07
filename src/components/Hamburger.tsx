"use client";

import lottie, { AnimationItem } from "lottie-web";
import * as HamburgerAnimation from "../animations/Hamburger.json";
import { useCallback, useEffect, useRef, useState } from "react";

interface HamburgerProps {
  onOpen: (open: boolean) => void;
}

export default function Hamburger({ onOpen }: HamburgerProps) {
  const [open, setOpen] = useState(false);

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

  const toggleMenu = useCallback(() => {
    animation.current?.playSegments(!open ? [0, 11] : [12, 22], true);
    setOpen(!open);
  }, [open]);

  useEffect(() => {
    onOpen(open);
  }, [onOpen, open]);

  return (
    <div
      role="button"
      onClick={toggleMenu}
      className="hamburger w-8 h-8 text-black"
      ref={hamburger}
    />
  );
}
