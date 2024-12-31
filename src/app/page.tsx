import Gallery from "@/components/Gallery";
import { getPhotos } from "@/lib/db/supabase";
import { Tables } from "../../supabase/database.types";
import { redirect } from "next/navigation";

export default async function Home() {
  const photos = await getPhotos("live");

  const handleClick = async (photo: Tables<"photos">) => {
    "use server";
    redirect(`/photo/${photo.drive_id}`);
  };

  return (
    <div className="m-8">
      <Gallery<"db">
        numColumns={7}
        photoSize={512}
        photos={photos.reverse()}
        onClick={handleClick}
      />
    </div>
  );
}
