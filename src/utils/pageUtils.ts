import { revalidatePath } from "next/cache";
import { Enums } from "../../supabase/database.types";

export const revalidatePages = async (page: Enums<"photo_type">) => {
    switch (page) {
        case "live":
            revalidatePath("/", "page");
            revalidatePath("/edit/current/live");
            break;
        case "festival":
            revalidatePath("/festival", "page");
            revalidatePath("/edit/current/festival");
            break;
        case "portrait":
            revalidatePath("/portrait", "page");
            revalidatePath("/edit/current/portrait");
            break;
    }

    revalidatePath("/photo/[id]", "page");
};
