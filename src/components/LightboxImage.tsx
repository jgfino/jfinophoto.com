"use client";

import Image from "next/image";
import { isDrivePhoto } from "@/lib/util";
import { GalleryPhoto, GalleryType } from "./Gallery";

interface LightboxImageProps<T extends GalleryType> {
  onClick?: (photo: GalleryPhoto<T>) => void;
  size: number;
  photo: GalleryPhoto<T>;
  grayed?: boolean;
}

export function LightboxImage<T extends GalleryType>({
  onClick,
  size,
  photo,
  grayed,
}: LightboxImageProps<T>) {
  return (
    <div
      onClick={() => {
        onClick?.(photo);
      }}
      key={isDrivePhoto(photo) ? photo.id : photo.drive_id}
      className={`${onClick ? "cursor-pointer" : ""} h-full ${
        grayed ? "opacity-50" : ""
      }`}
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
    </div>
  );
}
