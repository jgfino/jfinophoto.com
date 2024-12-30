import { getPhoto } from "@/lib/db/supabase";
import Image from "next/image";

export default async function Photo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const photo = await getPhoto(id);

  if (!photo) {
    return null;
  }

  return (
    <div className="h-screen w-full relative pointer-events-none">
      <Image
        className="p-8"
        unoptimized
        src={`${photo.thumbnail_link}=s1024`}
        alt="photo"
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
