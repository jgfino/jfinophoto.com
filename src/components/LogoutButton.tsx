"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface LogoutButtonProps {
  className?: string;
}

const browserClient = createSupabaseBrowserClient();

export default function LogoutButton({ className = "" }: LogoutButtonProps) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => browserClient.auth.signOut()}
      className={`cursor-pointer ml-2 text-md text-purple-900 font-bold uppercase tracking-wide hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {"Log out"}
    </button>
  );
}
