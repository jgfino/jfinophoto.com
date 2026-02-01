import { getPortfolioPhotos } from "@/lib/supabase/service";
import { Tables } from "../../supabase/database.types";
import { redirect } from "next/navigation";
import Gallery from "@/components/Gallery";

export default async function Home() {
  const photos = await getPortfolioPhotos("live");

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
