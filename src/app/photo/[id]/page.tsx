import { getPhoto } from "@/lib/db/supabase";
import { formatPath } from "@/lib/util";
import Image from "next/image";

export default async function Photo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const photo = await getPhoto(id);

  if (!photo) {
    throw new Error("Photo not found");
  }

  return (
    <div className="h-full w-full flex gap-4 md:gap-8 flex-col items-center justify-center pointer-events-none p-8">
      <div className="relative h-full w-full max-h-[1500px] max-w-[1500px]">
        <Image
          src={`${photo.thumbnail_link}=s1500`}
          alt="photo"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <p className="text-center text-gray-500">
        {formatPath(photo.path, true)}
      </p>
    </div>
  );
}
