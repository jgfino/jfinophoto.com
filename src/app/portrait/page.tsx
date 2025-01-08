import Gallery from "@/components/Gallery";
import { getPortfolioPhotos } from "@/lib/db/supabase";
import { Tables } from "../../../supabase/database.types";
import { redirect } from "next/navigation";

export default async function Portrait() {
  const photos = await getPortfolioPhotos("portrait");

  const handleClick = async (photo: Tables<"drive_cache">) => {
    "use server";
    redirect(`/photo/${photo.drive_id}`);
  };

  return (
    <div className="w-full h-full">
      <Gallery
        photoSize={1024}
        photos={photos}
        onPhotoClick={handleClick}
        showShuffle
        animated
      />
    </div>
  );
}
