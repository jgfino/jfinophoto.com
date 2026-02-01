import Gallery from "@/components/Gallery";
import { getPortfolioPhotos } from "@/lib/supabase/service";
import { redirect } from "next/navigation";
import { Tables } from "../../../supabase/database.types";

export default async function Festival() {
  const photos = await getPortfolioPhotos("festival");

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
