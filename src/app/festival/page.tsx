import Gallery from "@/components/Gallery";
import { getPhotos } from "@/lib/db/supabase";
import { redirect } from "next/navigation";
import { Tables } from "../../../supabase/database.types";

export default async function Festival() {
  const photos = await getPhotos("festival");

  const handleClick = async (photo: Tables<"photos">) => {
    "use server";
    redirect(`/photo/${photo.drive_id}`);
  };

  return (
    <div className="m-8">
      <Gallery<"db">
        numColumns={7}
        photoSize={512}
        photos={photos}
        onClick={handleClick}
      />
    </div>
  );
}
