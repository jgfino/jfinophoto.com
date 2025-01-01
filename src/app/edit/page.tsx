import { DrivePhoto, getDrivePhotos } from "@/lib/google/drive";
import { Enums, Tables } from "../../../supabase/database.types";
import {
  addPhotoToPage,
  getPhotos,
  removePhotoFromPage,
  removePhotosFromPage,
  // updatePhotoOrder,
} from "@/lib/db/supabase";
import { NavButton } from "@/components/NavButton";
import { revalidatePath } from "next/cache";
import Gallery from "@/components/Gallery";

type EditType = "drive" | "db";

export default async function Edit({
  searchParams,
}: {
  searchParams: Promise<{
    page?: Enums<"photo_page">;
    type?: EditType;
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

  const getLink = (type: EditType, page: Enums<"photo_page">) => {
    return `/edit?type=${type}&page=${page}${token ? `&token=${token}` : ""}`;
  };

  const onModalSubmit = async (
    photo: DrivePhoto,
    add?: Enums<"photo_page">,
    remove?: Enums<"photo_page">
  ) => {
    "use server";
    if (add) {
      await addPhotoToPage(photo, add);
    }
    if (remove) {
      await removePhotoFromPage(photo.id, remove);
    }
  };

  // const onOrderSaved = async (photos: Tables<"photos">[]) => {
  //   "use server";

  //   // Save the new photos in order
  //   const promises: Promise<void>[] = [];
  //   for (let i = 0; i < photos.length; i++) {
  //     if (photos[i].position !== i) {
  //       promises.push(updatePhotoOrder(photos[i], page, i));
  //     }
  //   }

  //   await Promise.all(promises);
  //   revalidatePath("/");
  // };

  const onPhotosRemoved = async (photos: Tables<"photos">[]) => {
    "use server";
    await removePhotosFromPage(
      photos.map((p) => p.drive_id),
      page
    );
    revalidatePath("/");
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-2 p-8 md:w-1/2 md:self-center">
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
        <div className="border-l-2 border-black rounded h-1/2 self-end hidden md:block" />
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
      {type === "drive" && (
        <div className="flex flex-row justify-center w-1/2 self-center gap-8">
          <NavButton
            className="flex-1 md:w-1/6 md:flex-none"
            text="Previous"
            backButton
          />
          <NavButton
            className="flex-1 md:w-1/6 md:flex-none"
            text="Next"
            href={`/edit?type=${type}&page=${page}${
              nextPageToken ? `&token=${nextPageToken}` : ""
            }`}
          />
        </div>
      )}
      <div className="flex-1">
        {type === "drive" ? (
          <Gallery
            photoSize={512}
            photos={drivePhotos}
            onModalSubmit={onModalSubmit}
            showModal
          />
        ) : (
          <Gallery
            showSave
            photoSize={512}
            photos={pagePhotos}
            onPhotosSelected={onPhotosRemoved}
          />
        )}
      </div>
    </div>
  );
}
