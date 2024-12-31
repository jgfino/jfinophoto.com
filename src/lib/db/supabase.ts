import { createClient } from "@supabase/supabase-js";
import { Database, Enums, Tables } from "../../../supabase/database.types";
import { DrivePhoto, getUpdatedThumbnailLinks } from "../google/drive";

const serviceClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

/**
 * Add a photo from drive to a page
 * @param photo The photo from drive to add
 */
export const addPhotoToPage = async (
  photo: DrivePhoto,
  page: Enums<"photo_page">,
) => {
  console.log(`Adding drive photo ${photo.id} to ${page}`);

  // Create a new photo object
  const now = new Date().toISOString();

  // Insert or update the new photo
  const { error } = await serviceClient.from("photos").upsert({
    created_at: now,
    updated_at: now,
    drive_id: photo.id,
    page: page,
    parent_folder_id: photo.parentFolderId,
    thumbnail_link: photo.thumbnailLink,
    thumbnail_updated_at: now,
    path: photo.path,
    width: photo.width,
    height: photo.height,
  }, {
    onConflict: "drive_id, page",
    ignoreDuplicates: true,
  });

  if (error) {
    throw error;
  }
};

/**
 * Delete a photo from a page
 * @param driveId The Google Drive ID of the photo
 * @param page The page to delete the photo from
 */
export const removePhotoFromPage = async (
  driveId: string,
  page: Enums<"photo_page">,
) => {
  console.log(`Deleting photo ${driveId}`);

  const { error } = await serviceClient
    .from("photos")
    .delete()
    .eq("drive_id", driveId)
    .eq("page", page);

  if (error) {
    throw error;
  }
};

/**
 * Delete multiple photos from a page
 * @param driveId The Google Drive ID of the photo
 * @param page The page to delete the photo from
 */
export const removePhotosFromPage = async (
  driveIds: string[],
  page: Enums<"photo_page">,
) => {
  console.log(`Deleting photos ${driveIds}`);

  const { error } = await serviceClient
    .from("photos")
    .delete()
    .in("drive_id", driveIds)
    .eq("page", page);

  if (error) {
    throw error;
  }
};

/**
 * Update the thumbnail links for all saved photos, if needed
 */
export const updateThumbnailLinks = async () => {
  const hourAgo = new Date(Date.now() - 1000 * 30 * 60).toISOString();

  const { data: toUpdate, error: toUpdateError } = await serviceClient.from(
    "photos",
  ).select("*")
    .lte(
      "thumbnail_updated_at",
      hourAgo,
    ).order("thumbnail_updated_at", { ascending: true }).limit(1);

  if (toUpdateError) {
    throw toUpdateError;
  }

  // All links are at most an hour old
  if (toUpdate.length === 0) {
    console.log(`All thumbnail links are up to date`);
    return;
  }

  console.log(`Updating database thumbnail links`);

  const allPhotos = await getPhotos();

  const { updated, notUpdated } = await getUpdatedThumbnailLinks(
    allPhotos,
  );

  // Remove the not updated photos from all pages
  for (const photo of notUpdated) {
    const { error } = await serviceClient
      .from("photos")
      .delete()
      .eq("drive_id", photo.drive_id);

    if (error) {
      throw error;
    }
  }

  // Update the updated photos
  for (const [driveId, thumbnailLink] of Object.entries(updated)) {
    const existing = await getPhoto(driveId);

    if (existing) {
      const { error } = await serviceClient
        .from("photos")
        .update({
          thumbnail_link: thumbnailLink,
          thumbnail_updated_at: new Date().toISOString(),
        })
        .eq("drive_id", driveId);

      if (error) {
        throw error;
      }
    }
  }
};

/**
 * Get the photos for the given page, or all pages if none is given
 * @param type The page type to get the photos for
 * @returns The photos for the page
 */
export const getPhotos = async (type?: Enums<"photo_page">) => {
  console.log(`Getting database photos for ${type} page`);

  const query = serviceClient.from("photos").select("*").order("position", {
    ascending: true,
  });

  if (type) {
    query.eq("page", type);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  // Shuffle
  data.sort(() => Math.random() - 0.5);

  return data || [];
};

/**
 * Get a photo by its Google Drive ID
 * @param driveId The Google Drive ID of the photo
 */
export const getPhoto = async (driveId: string) => {
  const { data, error } = await serviceClient
    .from("photos")
    .select("*")
    .eq("drive_id", driveId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Update a photo's page order
 *
 * @param photo The photo to update
 * @param page The page to update the photo on
 * @param position The new position of the photo
 */
export const updatePhotoOrder = async (
  photo: Tables<"photos">,
  page: Enums<"photo_page">,
  position: number,
) => {
  console.log(`Updating photo order for ${photo.drive_id}`);

  const { error } = await serviceClient
    .from("photos")
    .update({
      position,
    })
    .eq("drive_id", photo.drive_id).eq("page", page);

  if (error) {
    throw error;
  }
};
