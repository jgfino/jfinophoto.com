import { revalidatePath } from "next/cache";
import { Enums, Tables } from "../../supabase/database.types";
import type { DrivePhoto } from "./google/drive";

export const isDrivePhoto = (
  photo: Tables<"photos"> | DrivePhoto,
): photo is DrivePhoto => (photo as DrivePhoto).thumbnailLink !== undefined;

export const formatPath = (path: string[], full = false) => {
  const artist = path.at(0);
  const location = path.at(1);
  const year = path.at(2);

  const locationParts = location?.split(" | ");
  const date = locationParts?.at(0);
  const venue = locationParts?.at(2);
  const city = locationParts?.at(3);

  if (full) {
    // July 4, 2021
    const formattedDate = date
      ? new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      : year;

    return `${formattedDate} - ${artist} @ ${venue}, ${city}`;
  }

  return `${artist} (${year})`;
};

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

export const revalidatePages = async (page: Enums<"photo_page">) => {
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
