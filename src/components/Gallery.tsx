"use client";

import type { DrivePhoto } from "@/lib/google/drive";
import { Tables } from "../../supabase/database.types";
import { LightboxImage } from "./LightboxImage";
import { isDrivePhoto } from "@/lib/util";
import { useEffect, useState } from "react";

export type GalleryType = "drive" | "db";
export type GalleryPhoto<T extends GalleryType> = T extends "drive"
  ? DrivePhoto
  : Tables<"photos">;

export type GalleryBreakpoints = {
  [width: number]: number;
};

export const defaultBreakpoints: Record<string, number> = {
  5000: 10,
  3000: 9,
  2500: 8,
  2000: 7,
  1000: 6,
  900: 5,
  800: 4,
  700: 3,
  600: 2,
  400: 1,
};

interface GalleryProps<T extends GalleryType> {
  photos: GalleryPhoto<T>[];
  breakpoints?: GalleryBreakpoints;
  grayedPhotos?: string[];
  photoSize?: number;
  numColumns?: number;
  onClick?: (photo: GalleryPhoto<T>) => Promise<void> | void;
}

export default function Gallery<T extends GalleryType>({
  photos,
  grayedPhotos,
  photoSize,
  onClick,
  numColumns,
  breakpoints = defaultBreakpoints,
}: GalleryProps<T>) {
  const [responsiveCols, setResponsiveCols] = useState(numColumns || 7);

  // Responsive columns
  useEffect(() => {
    const handleResize = () => {
      if (!breakpoints) return;

      const width = window.innerWidth;
      const cols = Object.entries(breakpoints).find(([bp]) => width < +bp);
      if (!cols) {
        setResponsiveCols(Object.values(breakpoints).at(-1) || 7);
        return;
      }

      setResponsiveCols(cols[1]);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoints, numColumns]);

  return (
    <div className="w-full">
      <div
        className={`grid gap-2 grid-flow-row-dense grid-cols-${responsiveCols}`}
      >
        {photos.map((photo) => (
          <div
            key={isDrivePhoto(photo) ? photo.id : photo.drive_id}
            style={{
              gridColumnEnd: photo.width > photo.height ? `span 2` : `span 1`,
              gridRowEnd: `span 1`,
            }}
          >
            <LightboxImage
              grayed={grayedPhotos?.includes(
                isDrivePhoto(photo) ? photo.id : photo.drive_id
              )}
              size={photoSize || 220}
              photo={photo}
              onClick={onClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
