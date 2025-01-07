"use client";

import { useRouter } from "next/navigation";

interface NavButtonProps {
  href?: string;
  onClick?: () => void;
  text: string;
  outline?: boolean;
  className?: string;
}

export function NavButton({
  href,
  text,
  outline,
  onClick,
  className = "",
}: NavButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        if (href) {
          router.push(href);
        } else if (onClick) {
          onClick();
        }
      }}
      className={`${className} cursor-pointer p-2 rounded-md outline outline-2 outline-black ${
        outline ? "bg-white text-black" : "bg-black text-white"
      } `}
    >
      {text}
    </button>
  );
}
