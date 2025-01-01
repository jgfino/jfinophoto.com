import Gallery from "@/components/Gallery";
import { getPhotos } from "@/lib/db/supabase";
import { Tables } from "../../../supabase/database.types";
import { redirect } from "next/navigation";

export default async function Portrait() {
  const photos = await getPhotos("portrait");

  const handleClick = async (photo: Tables<"photos">) => {
    "use server";
    redirect(`/photo/${photo.drive_id}`);
  };

  return (
    <div className="w-full h-full">
      <Gallery
        photoSize={512}
        photos={photos}
        onPhotoClick={handleClick}
        showShuffle
        animated
      />
    </div>
  );
}
