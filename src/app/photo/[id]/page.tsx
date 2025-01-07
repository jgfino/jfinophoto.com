import { LightboxImage } from "@/components/LightboxImage";
import { getPhoto, getPhotos, PAGE_TYPES } from "@/lib/db/supabase";
import { formatPath } from "@/lib/util";

export async function generateStaticParams() {
  console.debug("Generating static params for individual photo pages");

  const params = [];
  for (const page of PAGE_TYPES) {
    const photos = await getPhotos(page);
    for (const photo of photos) {
      params.push({ id: photo.drive_id });
    }
  }
  return params;
}

export default async function Photo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.debug(`Rendering photo page for photo ${id}`);
  const photo = await getPhoto(id);

  if (!photo) {
    throw new Error("Photo not found");
  }

  return (
    <div className="h-full transition w-full flex gap-4 md:gap-8 flex-col items-center justify-center pointer-events-none p-8">
      <div className="relative h-full w-full max-h-[1500px] max-w-[1500px]">
        <LightboxImage
          animated="fade"
          src={`${photo.thumbnail_link}=s1500`}
          fill="contain"
        />
      </div>
      <p className="text-center text-gray-500">
        {formatPath(photo.path, true)}
      </p>
    </div>
  );
}
