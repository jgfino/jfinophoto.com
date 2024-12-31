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
    <div className="h-full w-full flex items-center justify-center bg-red-500 pointer-events-none">
      <div className="relative h-full" style={{ width: 1500 }}>
        <Image
          src={`${photo.thumbnail_link}=s1500`}
          alt="photo"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
