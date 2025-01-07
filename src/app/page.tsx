import { getPhotos } from "@/lib/db/supabase";
import { Tables } from "../../supabase/database.types";
import { redirect } from "next/navigation";
import Gallery from "@/components/Gallery";

export default async function Home() {
  const photos = await getPhotos("live");

  const handleClick = async (photo: Tables<"photos">) => {
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
