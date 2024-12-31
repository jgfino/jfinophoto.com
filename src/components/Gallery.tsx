"use client";

import type { DrivePhoto } from "@/lib/google/drive";
import { Tables } from "../../supabase/database.types";
import { LightboxImage } from "./LightboxImage";
import { formatPath, isDrivePhoto } from "@/lib/util";
import { useEffect, useState } from "react";
import Shuffle from "../../public/shuffle.svg";

export type GalleryType = "drive" | "db";
export type GalleryPhoto<T extends GalleryType> = T extends "drive"
  ? DrivePhoto
  : Tables<"photos">;

export type GalleryBreakpoints = {
  [width: number]: number;
};

export const defaultBreakpoints: Record<string, number> = {
  5000: 11,
  4000: 10,
  3500: 9,
  2500: 8,
  2000: 7,
  1000: 6,
  900: 5,
  800: 4,
  700: 3,
  600: 2,
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
  const [shuffledPhotos, setShuffledPhotos] = useState(photos);
  const [responsiveCols, setResponsiveCols] = useState(numColumns || 7);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("cell-visible");
        }
      });
    });

    const cells = document.querySelectorAll(".cell-hidden");

    cells.forEach((cell) => {
      observer.observe(cell);
    });

    return () => {
      window.scrollTo(0, 0);
      cells.forEach((cell) => {
        observer.unobserve(cell);
        cell.classList.remove("cell-visible");
      });
    };
  }, [shuffledPhotos]);

  // Update photos when they change
  useEffect(() => {
    setShuffledPhotos(photos);
  }, [photos]);

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
    <div className="w-full flex flex-col">
      <div
        className={`grid gap-8 grid-flow-row-dense grid-cols-${responsiveCols}`}
      >
        {shuffledPhotos.map((photo) => (
          <div
            key={isDrivePhoto(photo) ? photo.id : photo.drive_id}
            style={{
              gridColumnEnd: photo.width > photo.height ? `span 2` : `span 1`,
              gridRowEnd: `span 1`,
            }}
          >
            <LightboxImage
              className="cell-hidden"
              hoverText={formatPath(photo.path)}
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
      <button
        className="flex flex-row gap-2 items-center justify-center fixed text-black bottom-4 bg-white p-4 px-8 rounded-full shadow-md self-center"
        onClick={() => {
          setShuffledPhotos([...photos].sort(() => Math.random() - 0.5));
        }}
      >
        <Shuffle width={40} height={40} />
      </button>
    </div>
  );
}
