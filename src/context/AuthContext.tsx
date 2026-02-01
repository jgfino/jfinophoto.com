"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
};

import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType>({
  user: null,
});

const browserClient = createSupabaseBrowserClient();

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await browserClient.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    loadSession();

    const {
      data: { subscription },
    } = browserClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
