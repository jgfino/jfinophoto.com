import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../../../supabase/database.types";

export const createSupabaseBrowserClient = () => {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
};
