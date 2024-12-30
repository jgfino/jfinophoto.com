"use client";

import { useRouter } from "next/navigation";

interface NavButtonProps {
  href?: string;
  backButton?: boolean;
  onClick?: () => void;
  text: string;
  outline?: boolean;
  className?: string;
}

export function NavButton({
  href,
  backButton,
  text,
  outline,
  onClick,
  className = "",
}: NavButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        if (backButton) {
          router.back();
        } else if (href) {
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
