"use client";

import lottie, { AnimationItem } from "lottie-web";
import { useRef, useState, useEffect } from "react";
import * as MenuAnimation from "../animations/Hamburger.json";

export default function Hamburger() {
  const hamburger = useRef<HTMLDivElement>(null);
  const animation = useRef<AnimationItem>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hamburger.current) {
      animation.current = lottie.loadAnimation({
        container: hamburger.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: MenuAnimation,
      });

      return () => animation.current?.destroy();
    }
  }, []);

  return (
    <div
      data-collapse-toggle="navbar-default"
      className="text-black md:hidden h-6 w-6"
      aria-controls="navbar-default"
      aria-expanded={open}
      onClick={() => {
        animation.current?.playSegments(!open ? [0, 11] : [12, 22], true);
        setOpen(!open);
      }}
    >
      <div className="hamburger" ref={hamburger} />
    </div>
  );
}
