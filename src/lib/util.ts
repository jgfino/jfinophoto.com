import { revalidatePath } from "next/cache";
import { Enums } from "../../supabase/database.types";

export function shuffleArray<T>(array: T[]) {
  const copy = [...array];
  for (let i = copy.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

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
