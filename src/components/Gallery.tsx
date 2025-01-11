"use client";

import { Enums, Tables } from "../../supabase/database.types";
import InteractiveResponsiveGrid, {
  GridItem,
} from "./InteractiveResponsiveGrid";
import { formatFilename, shuffleArray } from "@/lib/util";
import { useCallback, useEffect, useState } from "react";
import { LightboxImage } from "./LightboxImage";
import Shuffle from "../../public/shuffle.svg";
import { NavButton } from "./NavButton";
import { EditModal } from "./EditModal";

interface GalleryProps {
  photoSize: number;
  photos: Tables<"drive_cache">[];

  showHoverText?: boolean;
  onPhotoClick?: (photo: Tables<"drive_cache">) => void;

  showShuffle?: boolean;
  animated?: boolean;

  showSave?: boolean;
  onPhotosSelected?: (photos: Tables<"drive_cache">[]) => void;

  showModal?: boolean;
  onModalSubmit?: (
    id: string,
    add?: Enums<"photo_type">,
    remove?: Enums<"photo_type">
  ) => Promise<void>;
}

type GalleryPhoto = GridItem & {
  src: string;
  original: Tables<"drive_cache">;
};

export default function Gallery({
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
}: GalleryProps) {
  const [items, setItems] = useState<GalleryPhoto[]>([]);
  useEffect(() => {
    const shuffledPhotos = showShuffle ? shuffleArray(photos) : photos;
    setItems(
      shuffledPhotos.map((p) => ({
        key: p.drive_id,
        width: p.width,
        height: p.height,
        src: `${p.thumbnail_link}=s${photoSize}`,
        original: p,
      }))
    );
  }, [photoSize, photos, showShuffle]);

  const [selectedItems, setSelectedItems] = useState<GalleryPhoto[]>([]);

  const [modalPhoto, setModalPhoto] = useState<Tables<"drive_cache">>();

  const handleModalSubmit = useCallback(
    async (add?: Enums<"photo_type">, remove?: Enums<"photo_type">) => {
      if (!modalPhoto) return;
      await onModalSubmit?.(modalPhoto.drive_id, add, remove);
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
          hoverText={
            showHoverText ? formatFilename(item.original.name) : undefined
          }
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
            onPhotosSelected?.(selectedItems.map((p) => p.original))
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
            setModalPhoto(item.original);
          } else {
            onPhotoClick?.(item.original);
          }
        }}
      />
      {showShuffle && (
        <button
          className="xl:absolute xl:top-16 xl:bottom-auto xl:shadow-none self-center bg-white p-2 px-8 rounded-full fixed justify-self-center shadow-lg bottom-4"
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
