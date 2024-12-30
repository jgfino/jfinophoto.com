import { Tables } from "../../supabase/database.types";
import type { DrivePhoto } from "./google/drive";

export const isDrivePhoto = (
  photo: Tables<"photos"> | DrivePhoto,
): photo is DrivePhoto => (photo as DrivePhoto).thumbnailLink !== undefined;
