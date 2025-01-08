import { createClient } from "@supabase/supabase-js";
import { Database, Enums, Tables } from "../../../supabase/database.types";
import { DrivePhoto, getDrivePhotos } from "../google/drive";

export const PAGE_TYPES = ["live", "festival", "portrait"] as const;

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
 * Get the photos for the given page, or all pages if none is given
 * @param type The page type to get the photos for
 * @returns The photos for the page
 */
export const getPhotos = async (
  page: Enums<"photo_page">,
): Promise<Tables<"photos">[]> => {
  console.log(`Getting database photos for ${page} page`);

  const query = serviceClient.from("photos").select("*").order("position", {
    ascending: true,
  });

  if (page) {
    query.eq("page", page);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
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
 * Get the google drive photos for a page, with caching
 * @param page The page type to get the photos for
 * @param updateCache To force an update of the cache
 * @returns The photos for the page
 */
export const getCachedDrivePhotos = async (
  page: Enums<"photo_page">,
  limit: number,
  offset: number,
): Promise<DrivePhoto[]> => {
  const { data, error } = await serviceClient
    .from("drive_cache")
    .select("*")
    .eq("type", page)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    console.warn(`No cached photos for ${page}, fetching from drive`);
    await updateCacheAndThumbnailLinks(true);
    return getCachedDrivePhotos(page, limit, offset);
  }

  const photos = JSON.parse(data.data) as DrivePhoto[];

  console.log(`Getting cached drive photos for ${page}`);

  return photos.slice(offset, offset + limit);
};

/**
 * Update the cache and thumbnail links for all pages
 * @param force Whether to force an update of the cache
 */
export const updateCacheAndThumbnailLinks = async (force = false) => {
  await Promise.all(PAGE_TYPES.map(async (page) => {
    // First, see if we have a valid cache entry
    const { data, error } = await serviceClient
      .from("drive_cache")
      .select("*")
      .eq("type", page)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data && !force) {
      const halfHourAgo = new Date(Date.now() - 1000 * 30 * 60);
      const createdAt = new Date(data.created_at);

      if (createdAt > halfHourAgo) {
        console.log(
          `Drive cache and thumbnail links are up to date for ${page}`,
        );
        return;
      } else {
        console.log(`Drive cache and thumbnail links are stale for ${page}`);
      }
    }

    const drivePhotos = await getDrivePhotos(page);

    // Update cache entry
    await serviceClient.from("drive_cache").upsert({
      data: JSON.stringify(drivePhotos),
      type: page,
      created_at: new Date().toISOString(),
    });

    // Update portfolio thumbnails
    for (const photo of drivePhotos) {
      const { error } = await serviceClient
        .from("photos")
        .update({
          thumbnail_link: photo.thumbnailLink,
          thumbnail_updated_at: new Date().toISOString(),
        })
        .eq("drive_id", photo.id);

      if (error) {
        throw error;
      }
    }

    console.log(`Updated drive cache and thumbnail links for ${page}`);
  }));
};
