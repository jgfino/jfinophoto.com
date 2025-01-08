import {
  addPhotoToPage,
  getCachedDrivePhotos,
  removePhotoFromPage,
  updateDrivePhotos,
} from "@/lib/db/supabase";
import { NavButton } from "@/components/NavButton";
import { revalidatePath } from "next/cache";
import Gallery from "@/components/Gallery";
import { Enums } from "../../../../../supabase/database.types";
import { revalidatePages } from "@/lib/util";

// Number of photos per page
const PAGE_SIZE = 100;

export const maxDuration = 60;

export default async function Edit({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    page?: number;
  }>;
  params: Promise<{ type: Enums<"photo_type"> }>;
}) {
  const { type } = await params;
  const { page } = await searchParams;

  const drivePhotos = await getCachedDrivePhotos(
    type,
    PAGE_SIZE,
    Number(page || 0) * PAGE_SIZE
  );

  const onModalSubmit = async (
    id: string,
    add?: Enums<"photo_type">,
    remove?: Enums<"photo_type">
  ) => {
    "use server";
    if (add) {
      await addPhotoToPage(id, add);
      await revalidatePages(add);
    }
    if (remove) {
      await removePhotoFromPage(id, remove);
      await revalidatePages(remove);
    }
  };

  const refreshDrivePhotos = async () => {
    "use server";
    await updateDrivePhotos(false);
    revalidatePath(`/edit/all/${type}`);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex w-full flex-col p-8 gap-8">
        <div className="flex flex-col md:flex-row gap-2 md:w-2/3 md:self-center">
          <div className="flex flex-1 text-center flex-col gap-2">
            <p className="text-lg font-bold">ALL</p>
            <div className="flex flex-row flex-1 gap-4 justify-center">
              <NavButton
                className="flex-1"
                href={"/edit/all/live/1"}
                outline={type !== "live"}
                text="LIVE"
              />
              <NavButton
                className="flex-1"
                href={"/edit/all/festival/1"}
                outline={type !== "festival"}
                text="FESTIVAL"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center w-1/2 self-center gap-4">
          <NavButton
            className="flex-1"
            text="Previous"
            href={`/edit/all/${type}?page=${Math.max(
              Number(page ?? 0) - 1,
              0
            )}`}
          />
          <NavButton
            className="flex-1"
            text="Next"
            href={`/edit/all/${type}?page=${Number(page ?? 0) + 1}`}
          />
        </div>
        <div className="flex flex-row justify-center w-1/2 self-center">
          <NavButton
            className="flex-1"
            text="Refresh Drive Photos"
            onClick={refreshDrivePhotos}
          />
        </div>
      </div>
      <div className="flex-1">
        <Gallery
          photoSize={512}
          photos={drivePhotos}
          onModalSubmit={onModalSubmit}
          showModal
        />
      </div>
    </div>
  );
}
