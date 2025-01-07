"use client";

import lottie, { AnimationItem } from "lottie-web";
import { useRef, useState, useEffect, useCallback } from "react";
import * as MenuAnimation from "../animations/Hamburger.json";
import Link from "next/link";

export interface HamburgerProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Hamburger({ className, children }: HamburgerProps) {
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

  const toggleMenu = useCallback(() => {
    animation.current?.playSegments(!open ? [0, 11] : [12, 22], true);
    setOpen(!open);
  }, [open]);

  return (
    <div className={`h-full w-full ${className}`} aria-expanded={open}>
      <div className="flex flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          JULIA FINOCCHIARO
        </Link>
        <div
          role="button"
          onClick={toggleMenu}
          className="hamburger w-8 h-8 text-black"
          ref={hamburger}
        />
      </div>
      <div
        className={`h-full absolute left-0 right-0 z-50 bg-white duration-300 motion-reduce:duration-0 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        id="navbar-default"
      >
        {children}
      </div>
    </div>
  );
}
