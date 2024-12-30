import { DrivePhoto, getDrivePhotos } from "@/lib/google/drive";
import { Enums, Tables } from "../../../supabase/database.types";
import {
  addPhotoToPage,
  getPhotos,
  removePhotoFromPage,
  removePhotosFromPage,
  updatePhotoOrder,
} from "@/lib/db/supabase";
import { NavButton } from "@/components/NavButton";
import { InteractiveDatabaseGallery } from "@/components/InteractiveDatabaseGallery";
import { GalleryType } from "@/components/Gallery";
import { InteractiveDriveGallery } from "@/components/InteractiveDriveGallery";
import { revalidatePath } from "next/cache";

export default async function Edit({
  searchParams,
}: {
  searchParams: Promise<{
    page?: Enums<"photo_page">;
    type?: GalleryType;
    token?: string;
  }>;
}) {
  let { type, page } = await searchParams;
  const { token } = await searchParams;

  type = type ?? "drive";
  page = page ?? "live";

  let nextPageToken: string | undefined;

  const drivePhotos: DrivePhoto[] = [];
  const pagePhotos = await getPhotos(type === "drive" ? undefined : page);

  if (type === "drive") {
    const allPhotos = await getDrivePhotos(page, 100, token);
    nextPageToken = allPhotos.nextPageToken || undefined;
    drivePhotos.push(...allPhotos.photos);
  }

  const getLink = (type: GalleryType, page: Enums<"photo_page">) => {
    return `/edit?type=${type}&page=${page}${token ? `&token=${token}` : ""}`;
  };

  const onModalSubmit = async (
    photo: DrivePhoto,
    added: Enums<"photo_page">[],
    removed: Enums<"photo_page">[]
  ) => {
    "use server";
    const promises: Promise<void>[] = [];
    for (const page of added) {
      promises.push(addPhotoToPage(photo, page));
    }
    for (const page of removed) {
      promises.push(removePhotoFromPage(photo.id, page));
    }
    await Promise.all(promises);
  };

  const onOrderSaved = async (photos: Tables<"photos">[]) => {
    "use server";

    // Save the new photos in order
    const promises: Promise<void>[] = [];
    for (let i = 0; i < photos.length; i++) {
      if (photos[i].position !== i) {
        promises.push(updatePhotoOrder(photos[i], page, i));
      }
    }

    await Promise.all(promises);
    revalidatePath("/");
  };

  const onPhotosRemoved = async (photos: Tables<"photos">[]) => {
    "use server";
    await removePhotosFromPage(
      photos.map((p) => p.drive_id),
      page
    );
    revalidatePath("/");
  };

  return (
    <div className="flex flex-col gap-2 mt-2 items-center w-full p-8 pl-0">
      <div className="flex flex-row gap-2 w-1/2">
        <div className="flex flex-1 text-center flex-col gap-2">
          <p className="text-lg font-bold">ALL</p>
          <div className="flex flex-row flex-1 gap-2 justify-center">
            <NavButton
              className="flex-1"
              href={getLink("drive", "live")}
              outline={!(page === "live" && type === "drive")}
              text="CONCERTS"
            />
            <NavButton
              className="flex-1"
              href={getLink("drive", "portrait")}
              outline={!(page === "festival" && type === "drive")}
              text="FESTIVALS"
            />
          </div>
        </div>
        <div className="border-l-2 border-black rounded h-1/2 self-end" />
        <div className="flex flex-1 text-center flex-col gap-2">
          <p className="text-lg font-bold">CURRENT</p>
          <div className="flex flex-row flex-1 gap-2 justify-center">
            <NavButton
              className="flex-1"
              href={getLink("db", "live")}
              outline={!(page === "live" && type === "db")}
              text="LIVE"
            />
            <NavButton
              className="flex-1"
              href={getLink("db", "festival")}
              outline={!(page === "festival" && type === "db")}
              text="FESTIVAL"
            />
            <NavButton
              className="flex-1"
              href={getLink("db", "portrait")}
              outline={!(page === "portrait" && type === "db")}
              text="PORTRAIT"
            />
          </div>
        </div>
      </div>
      {type === "drive" ? (
        <InteractiveDriveGallery
          pagePhotos={pagePhotos}
          drivePhotos={drivePhotos}
          onModalSubmit={onModalSubmit}
        />
      ) : (
        <InteractiveDatabaseGallery
          pagePhotos={pagePhotos}
          onReorder={onOrderSaved}
          onRemove={onPhotosRemoved}
        />
      )}
      {type === "drive" && (
        <div className="flex flex-row justify-between w-full">
          <NavButton className="w-1/12" text="Previous" backButton />
          <NavButton
            className="w-1/6"
            text="Next"
            href={`/edit?type=${type}&page=${page}${
              nextPageToken ? `&token=${nextPageToken}` : ""
            }`}
          />
        </div>
      )}
    </div>
  );
}
