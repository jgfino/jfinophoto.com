import { Enums, Tables } from "../../../../../supabase/database.types";
import { getPortfolioPhotos, removePhotosFromPage } from "@/lib/db/supabase";
import { NavButton } from "@/components/NavButton";
import Gallery from "@/components/Gallery";
import { revalidatePages } from "@/lib/util";

export default async function Edit({
  params,
}: {
  params: Promise<{
    type: Enums<"photo_type">;
  }>;
}) {
  const { type } = await params;

  const pagePhotos = await getPortfolioPhotos(type);

  const onPhotosRemoved = async (photos: Tables<"drive_cache">[]) => {
    "use server";
    await removePhotosFromPage(
      photos.map((p) => p.drive_id),
      type
    );
    await revalidatePages(type);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-2 p-8 md:w-2/3 md:self-center">
        <div className="flex flex-1 text-center flex-col gap-2">
          <p className="text-lg font-bold">CURRENT</p>
          <div className="flex flex-row flex-1 gap-2 justify-center">
            <NavButton
              className="flex-1"
              href="/edit/current/live"
              outline={type !== "live"}
              text="LIVE"
            />
            <NavButton
              className="flex-1"
              href="/edit/current/festival"
              outline={type !== "festival"}
              text="FESTIVAL"
            />
            <NavButton
              className="flex-1"
              href="/edit/current/portrait"
              outline={type !== "portrait"}
              text="PORTRAIT"
            />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Gallery
          showSave
          photoSize={512}
          photos={pagePhotos}
          onPhotosSelected={onPhotosRemoved}
        />
      </div>
    </div>
  );
}
