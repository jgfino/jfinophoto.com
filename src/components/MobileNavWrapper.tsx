"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Hamburger = dynamic(() => import("./Hamburger"), { ssr: false });

export interface HamburgerProps {
  className?: string;
  children?: React.ReactNode;
}

export default function MobileNavWrapper({
  className,
  children,
}: HamburgerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`h-full w-full ${className}`} aria-expanded={open}>
      <div className="flex flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          JULIA FINOCCHIARO
        </Link>
        <Hamburger onOpen={setOpen} />
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
