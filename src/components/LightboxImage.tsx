"use client";

import Image from "next/image";
import { isDrivePhoto } from "@/lib/util";
import { GalleryPhoto, GalleryType } from "./Gallery";

interface LightboxImageProps<T extends GalleryType> {
  className?: string;
  onClick?: (photo: GalleryPhoto<T>) => void;
  size: number;
  photo: GalleryPhoto<T>;
  grayed?: boolean;
  hoverText?: string;
}

export function LightboxImage<T extends GalleryType>({
  className,
  onClick,
  size,
  photo,
  grayed,
  hoverText,
}: LightboxImageProps<T>) {
  return (
    <div
      onClick={() => {
        onClick?.(photo);
      }}
      key={isDrivePhoto(photo) ? photo.id : photo.drive_id}
      className={`relative group ${onClick ? "cursor-pointer" : ""} h-full ${
        grayed ? "opacity-50" : ""
      } ${className}`}
    >
      <Image
        alt="alt"
        src={`${
          isDrivePhoto(photo) ? photo.thumbnailLink : photo.thumbnail_link
        }?=s${size}`}
        height={photo.height}
        width={photo.width}
        style={{ objectFit: "cover", height: "100%" }}
      />
      {hoverText && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-center p-2 hidden group-hover:block">
          <span className="text-white text-md">{hoverText}</span>
        </div>
      )}
    </div>
  );
}
