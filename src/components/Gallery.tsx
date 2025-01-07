"use client";

import { DrivePhoto } from "@/lib/google/drive";
import { Enums, Tables } from "../../supabase/database.types";
import InteractiveResponsiveGrid, {
  GridItem,
} from "./InteractiveResponsiveGrid";
import { formatPath, isDrivePhoto, shuffleArray } from "@/lib/util";
import { useCallback, useEffect, useState } from "react";
import { LightboxImage } from "./LightboxImage";
import Shuffle from "../../public/shuffle.svg";
import { NavButton } from "./NavButton";
import { EditModal } from "./EditModal";

interface GalleryProps<T extends DrivePhoto | Tables<"photos">> {
  photoSize: number;
  photos: T[];

  showHoverText?: boolean;
  onPhotoClick?: (photo: T) => void;

  showShuffle?: boolean;
  animated?: boolean;

  showSave?: boolean;
  onPhotosSelected?: (photos: T[]) => void;

  showModal?: boolean;
  onModalSubmit?: (
    photo: DrivePhoto,
    add?: Enums<"photo_page">,
    remove?: Enums<"photo_page">
  ) => Promise<void>;
}

type GalleryPhoto = GridItem & {
  src: string;
  original: DrivePhoto | Tables<"photos">;
};

export default function Gallery<T extends DrivePhoto | Tables<"photos">>({
  photos,
  photoSize,
  showHoverText = true,
  onPhotoClick,
  showShuffle,
  animated,
  showSave,
  onPhotosSelected,
  showModal,
  onModalSubmit,
}: GalleryProps<T>) {
  const [items, setItems] = useState<GalleryPhoto[]>([]);
  useEffect(() => {
    const shuffledPhotos = showShuffle ? shuffleArray(photos) : photos;
    setItems(
      shuffledPhotos.map((p) => ({
        key: isDrivePhoto(p) ? p.id : p.drive_id,
        width: p.width,
        height: p.height,
        src: `${
          isDrivePhoto(p) ? p.thumbnailLink : p.thumbnail_link
        }=s${photoSize}`,
        original: p,
      }))
    );
  }, [photoSize, photos, showShuffle]);

  const [selectedItems, setSelectedItems] = useState<GalleryPhoto[]>([]);

  const [modalPhoto, setModalPhoto] = useState<DrivePhoto>();

  const handleModalSubmit = useCallback(
    async (add?: Enums<"photo_page">, remove?: Enums<"photo_page">) => {
      if (!modalPhoto) return;
      await onModalSubmit?.(modalPhoto, add, remove);
      setModalPhoto(undefined);
    },
    [onModalSubmit, modalPhoto]
  );

  const renderItem = useCallback(
    (item: GalleryPhoto, index: number, selected: boolean) => {
      return (
        <LightboxImage
          key={index.toString()}
          animated={animated ? "full" : undefined}
          src={item.src}
          width={item.width}
          height={item.height}
          grayed={selected}
          hoverText={showHoverText ? formatPath(item.original.path) : undefined}
        />
      );
    },
    [showHoverText, animated]
  );

  return (
    <div className="md:p-8 p-2 flex flex-col">
      {showSave && (
        <NavButton
          text="Save"
          className="self-center w-1/2 md:w-1/6"
          onClick={() =>
            onPhotosSelected?.(selectedItems.map((p) => p.original as T))
          }
        />
      )}
      <InteractiveResponsiveGrid
        selectable={!!onPhotosSelected}
        onItemsSelected={setSelectedItems}
        items={items}
        selectedItems={selectedItems}
        margin={16}
        renderItem={renderItem}
        onItemClicked={(item) => {
          if (showModal) {
            setModalPhoto(item.original as DrivePhoto);
          } else {
            onPhotoClick?.(item.original as T);
          }
        }}
      />
      {showShuffle && (
        <button
          className="shadow-lg xl:shadow-none xl:absolute xl:bottom-auto text-black xl:top-16 bottom-4 xl:left-0 xl:right-0 p-2 fixed self-center justify-self-center bg-white px-8 rounded-full"
          onClick={() => {
            setItems((prev) => {
              return shuffleArray(prev);
            });
            window.scrollTo(0, 0);
          }}
        >
          <Shuffle width={40} height={40} />
        </button>
      )}
      {modalPhoto && (
        <EditModal
          onClose={() => setModalPhoto(undefined)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
