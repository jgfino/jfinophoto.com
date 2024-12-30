"use client";

import { useCallback, useMemo, useState } from "react";
import { Enums, Tables } from "../../supabase/database.types";
import Gallery from "./Gallery";
import { EditModal } from "./EditModal";
import type { DrivePhoto } from "@/lib/google/drive";

interface InteractiveDriveGalleryProps {
  pagePhotos: Tables<"photos">[];
  drivePhotos: DrivePhoto[];

  onModalSubmit: (
    photo: DrivePhoto,
    add: Enums<"photo_page">[],
    remove: Enums<"photo_page">[]
  ) => Promise<void>;
}

export function InteractiveDriveGallery({
  pagePhotos,
  drivePhotos,
  onModalSubmit,
}: InteractiveDriveGalleryProps) {
  const [photoUpdates, setPhotoUpdates] = useState<
    Record<string, Enums<"photo_page">[]>
  >({});
  const [selectedPhoto, setSelectedPhoto] = useState<DrivePhoto>();

  const handleSubmit = useCallback(
    async (
      photo: DrivePhoto,
      all: Enums<"photo_page">[],
      added: Enums<"photo_page">[],
      removed: Enums<"photo_page">[]
    ) => {
      await onModalSubmit(photo, added, removed);

      // Client-side update to prevent re-fetching
      setPhotoUpdates((prev) => {
        return {
          ...prev,
          [photo.id]: all,
        };
      });

      setSelectedPhoto(undefined);
    },
    [onModalSubmit]
  );

  const selectedPages = useMemo(() => {
    if (!selectedPhoto) return [];
    return (
      photoUpdates[selectedPhoto.id] ??
      pagePhotos
        .filter((p) => p.drive_id === selectedPhoto.id)
        .map((p) => p.page)
    );
  }, [selectedPhoto, photoUpdates, pagePhotos]);

  const activePhotos = useMemo(() => {
    return drivePhotos.reduce<string[]>((acc, photo) => {
      // On the page and if we've updated, it's not to 0 pages
      const onPage =
        pagePhotos.some((p) => p.drive_id === photo.id) &&
        (!photoUpdates[photo.id] || photoUpdates[photo.id].length > 0);

      // Will be on the page (updated to be on > 0 pages)
      const willBeOnPage =
        photoUpdates[photo.id] && photoUpdates[photo.id].length > 0;

      if (onPage || willBeOnPage) {
        acc.push(photo.id);
      }
      return acc;
    }, []);
  }, [drivePhotos, pagePhotos, photoUpdates]);

  return (
    <div className="flex-1">
      <Gallery<"drive">
        photoSize={220}
        numColumns={7}
        photos={drivePhotos}
        onClick={setSelectedPhoto}
        grayedPhotos={activePhotos}
      />
      {selectedPhoto && (
        <EditModal
          photo={selectedPhoto}
          initialSelected={selectedPages}
          onClose={() => setSelectedPhoto(undefined)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
